// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Table,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Badge
} from 'reactstrap';
import Select from 'react-select';
import electron from 'electron';
import fs from 'fs';
import nanoid from 'nanoid';
import routes from '../constants/routes';
import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';
import ModalUploader from './ModalUploader';
import { tableDateFormat, getListOfYears } from '../utils/dateFormat';
import { toast } from 'react-toastify';

type Props = {};

export default class Edit extends Component<Props> {
  constructor(props) {
    super(props);
    this.modal = React.createRef();
  }

  props: Props;

  state = {
    selectedOption: null
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  yearInput = () => {
    const { selectedOption } = this.state;
    const options = getListOfYears().map(el => ({
      value: el,
      label: el
    }));
    return (
      <WrappedSelect
        value={selectedOption}
        onChange={this.handleChange}
        options={options}
      />
    );
  };

  userDataPath = () =>
    (electron.app || electron.remote.app).getPath('userData');

  saveFile = file => {
    const { addRef } = this.props;
    const { selectedOption } = this.state;
    if (!selectedOption) {
      toast.error('Выберите год', {
        position: toast.POSITION.TOP_CENTER
      });
      return;
    }
    const userDataPath = this.userDataPath();
    console.log(userDataPath);
    const reader = new FileReader();
    reader.onload = f => {
      const data = f.target.result;
      const id = nanoid();
      const {
        location: {
          state: { id: userId }
        }
      } = this.props;
      if (!fs.existsSync(`${userDataPath}/refs`)) {
        fs.mkdirSync(`${userDataPath}/refs`);
      }
      fs.writeFileSync(`${userDataPath}/refs/${id}.xsb`, data, 'binary');
      addRef({
        id,
        userId,
        year: selectedOption.value
      });
      toast.success('Файл успешно добавлен', {
        position: toast.POSITION.TOP_CENTER
      });
      this.modal.current.decline();
      this.setState({ selectedOption: null });
    };
    reader.readAsBinaryString(file);
  };

  removeFile = el => {
    const { removeRef } = this.props;
    const userDataPath = this.userDataPath();
    try {
      fs.unlinkSync(`${userDataPath}/refs/${el.id}.xsb`);
    } catch (e) {
      console.log(e);
    }
    removeRef(el);
  };

  downloadFile = el => {
    const {
      location: { state }
    } = this.props;
    const desktopPath = electron.remote.app.getPath('desktop');
    const userChosenPath = electron.remote.dialog.showSaveDialog({
      defaultPath: `${desktopPath}/${state.family}_${state.name}_${
        state.patronymic
      }_${el.year}.xsb`
    });
    const userDataPath = this.userDataPath();
    if (userChosenPath) {
      fs.copyFile(`${userDataPath}/refs/${el.id}.xsb`, userChosenPath, err => {
        if (err) throw err;
        console.log('copied successfully');
      });
    }
  };

  render() {
    const {
      location: { state },
      references
    } = this.props;

    const filteredReferences = references.filter(el => el.userId === state.id);

    return (
      <Container data-tid="container">
        <Breadcrumb tag="nav" listTag="div">
          <BreadcrumbItem>
            <Link to={routes.HOME}>Реестр</Link>
          </BreadcrumbItem>
          <BreadcrumbItem tag="span" active>
            Редактирование
          </BreadcrumbItem>
        </Breadcrumb>
        <Card className="mb-3">
          <CardBody>
            <CardTitle>
              {`${state.family} ${state.name} ${state.patronymic}`}
              <Badge className="ml-1" color="primary">
                {tableDateFormat(state.birthday)}
              </Badge>
            </CardTitle>
            <CardSubtitle>ИНН: {state.taxpayerNumber}</CardSubtitle>
            <CardSubtitle>Тип реестра: {state.registryType}</CardSubtitle>
            <CardText>{state.position}</CardText>
          </CardBody>
        </Card>

        <ModalUploader
          acceptedFiles=".xsb"
          title="Выберите файл"
          buttonLabel="Загрузить справку"
          action={this.saveFile}
          ref={this.modal}
        >
          {this.yearInput()}
        </ModalUploader>
        <BorderContainer>
          <Table responsive hover striped size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Период отчетности</th>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredReferences.map((el, index) => (
                <tr key={el.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{el.year}</td>
                  <td>
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        this.downloadFile(el);
                      }}
                    >
                      <FontAwesomeIcon icon="file" />
                    </a>
                  </td>
                  <td>
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        this.removeFile(el);
                      }}
                    >
                      <FontAwesomeIcon icon="trash" />
                    </a>
                  </td>
                </tr>
              ))}
              {filteredReferences.length === 0 && (
                <tr className="table-light">
                  <td colSpan="4" className="text-center mt-4">
                    Список пуст
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </BorderContainer>
      </Container>
    );
  }
}

const Container = styled.div`
  padding: 15px;
`;

const BorderContainer = styled.div`
  border: solid #f7f7f9;
  border-width: 0.2rem;
`;

const WrappedSelect = styled(Select)`
  margin-bottom: 15px;
`;
