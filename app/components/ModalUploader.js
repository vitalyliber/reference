import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge
} from 'reactstrap';
import Dropzone from 'react-dropzone';
import fileExtension from 'file-extension';
import { toast } from 'react-toastify';

type Props = {
  buttonLabel: string,
  title: string,
  acceptedFiles: string,
  parseData: () => void
};

class ModalUploader extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      file: null
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(({ modal }) => ({
      modal: !modal
    }));
  }

  handleFile = files => {
    console.log(files);
    const { acceptedFiles } = this.props;
    if (!acceptedFiles.includes(fileExtension(files[0] && files[0].name))) {
      return toast.error('Неверный формат файла', {
        position: toast.POSITION.TOP_CENTER
      });
    }
    this.setState({ file: files[0] });
  };

  decline = () => {
    this.toggle();
    this.clearFile();
  };

  clearFile = () => this.setState({ file: null });

  parseData = () => {
    const { file } = this.state;
    const { action } = this.props;

    if (!file) {
      return toast.error('Выберите файл', {
        position: toast.POSITION.TOP_CENTER
      });
    }

    action(file);
  };

  render() {
    const { buttonLabel, title, acceptedFiles, children } = this.props;
    const { modal, file } = this.state;

    return (
      <div>
        <Button
          size="sm"
          color="primary"
          onClick={this.toggle}
          className="mb-3 text-uppercase"
        >
          {buttonLabel}
        </Button>
        <Modal isOpen={modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
          <ModalBody>
            {children}
            {!file && (
              <Dropzone multiple={false} maxFiles={1} onDrop={this.handleFile}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p className="text-center mb-1">
                        Перетащите сюда файл в формат{acceptedFiles.length === 1 ? 'е' : 'ах'}
                      </p>
                      <div className="d-flex justify-content-center">
                        {acceptedFiles.map(extension => (
                          <Badge key={extension} className="ml-1" color="info">
                            {extension}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-center">Или кликните, чтобы выбрать</p>
                    </div>
                  </section>
                )}
              </Dropzone>
            )}
            {file && <p className="text-center">{file.name}</p>}
          </ModalBody>
          <ModalFooter>
            <Button
              className="text-uppercase"
              color="primary"
              onClick={this.parseData}
            >
              Сохранить
            </Button>{' '}
            <Button
              className="text-uppercase"
              color="secondary"
              onClick={this.decline}
            >
              Отмена
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalUploader;
