// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fileExtension from 'file-extension';
import { confirmAlert } from 'react-confirm-alert';
import {
  Table,
  Breadcrumb,
  BreadcrumbItem,
  Card,
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
import getUserDataPath from '../utils/userDataPath';
import '!style-loader!css-loader!bootstrap/dist/css/bootstrap.css';
import ModalUploader from './ModalUploader';
import { tableDateFormat, getListOfYears } from '../utils/dateFormat';
import { toast } from 'react-toastify';
import _ from 'lodash';

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

  saveFile = file => {
    const { addRef } = this.props;
    const extension = fileExtension(file.name);
    const { selectedOption } = this.state;
    if (!selectedOption) {
      toast.error('Выберите год', {
        position: toast.POSITION.TOP_CENTER
      });
      return;
    }
    const userDataPath = getUserDataPath();
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
      fs.writeFileSync(
        `${userDataPath}/refs/${id}.${extension}`,
        data,
        'binary'
      );
      addRef({
        id,
        userId,
        extension,
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
    const userDataPath = getUserDataPath();
    confirmAlert({
      title: 'Подтвердите удаление',
      message: 'Вы уверены, что хотите удалить справку?',
      buttons: [
        {
          label: 'Да',
          onClick: () => {
            try {
              fs.unlinkSync(`${userDataPath}/refs/${el.id}.${el.extension}`);
            } catch (e) {
              console.log(e);
            }
            removeRef(el);
          }
        },
        {
          label: 'Нет',
          onClick: () => {}
        }
      ]
    });
  };

  downloadFile = el => {
    const {
      location: { state }
    } = this.props;
    const desktopPath = electron.remote.app.getPath('desktop');
    const userChosenPath = electron.remote.dialog.showSaveDialog({
      defaultPath: `${desktopPath}/${state.lastName}_${state.name}_${
        state.patronymic
      }_${el.year}.${el.extension}`
    });
    const userDataPath = getUserDataPath();
    if (userChosenPath) {
      fs.copyFile(
        `${userDataPath}/refs/${el.id}.${el.extension}`,
        userChosenPath,
        err => {
          if (err) throw err;
          console.log('copied successfully');
        }
      );
    }
  };

  render() {
    const {
      location: { state },
      references
    } = this.props;

    const filteredReferences = references.filter(el => el.userId === state.id);
    const sortedReferences = _.orderBy(filteredReferences, ['year'], ['desc']);

    return (
      <Container data-tid="container">
        <Breadcrumb tag="nav" listTag="div">
          <BreadcrumbItem>
            <Link to={routes.HOME}>Реестр лиц, подающих справку БК</Link>
          </BreadcrumbItem>
          <BreadcrumbItem tag="span" active>
            Редактирование
          </BreadcrumbItem>
        </Breadcrumb>
        <Card className="mb-3">
          <CardBody>
            <CardTitle className="text-capitalize">
              {`${state.lastName} ${state.name} ${state.patronymic}`}
              {state.birthday && (
                <Badge className="ml-1" color="primary">
                  {tableDateFormat(state.birthday)}
                </Badge>
              )}
              <Badge className="ml-1" color="info">
                {state.position}
              </Badge>
            </CardTitle>
            {state.taxpayerNumber && (
              <CardSubtitle>ИНН: {state.taxpayerNumber}</CardSubtitle>
            )}
            {state.registryType && (
              <CardSubtitle>Тип реестра: {state.registryType}</CardSubtitle>
            )}
          </CardBody>
        </Card>

        <ModalUploader
          acceptedFiles={['xsb', 'xlsx', 'pdf', 'doc', 'docx']}
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
                <th>Формат</th>
              </tr>
            </thead>
            <tbody>
              {sortedReferences.map((el, index) => (
                <tr key={el.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{el.year}</td>
                  <ActionsTd>
                    <BadgeExtension
                      color="dark"
                      onClick={() => {
                        this.downloadFile(el);
                      }}
                    >
                      {el.extension}
                      <FontAwesomeIcon icon="file" />
                    </BadgeExtension>
                    <IconDelete
                      icon="trash"
                      onClick={() => {
                        this.removeFile(el);
                      }}
                    />
                  </ActionsTd>
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

const IconDelete = styled(FontAwesomeIcon)`
  cursor: pointer;
  color: red;
`;

const BadgeExtension = styled(Badge)`
    cursor: pointer;
    width: 50px;
    display: flex !important;
    flex-direction: row;
    justify-content: space-between;
`;

const ActionsTd = styled.td`
  width: 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
