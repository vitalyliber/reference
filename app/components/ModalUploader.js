import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Dropzone from 'react-dropzone';
import fileExtension from 'file-extension';

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
    this.setState({ file: files[0] });
  };

  decline = () => {
    this.toggle();
    this.handleFile([null]);
  };

  parseData = () => {
    const { file } = this.state;
    const { action, acceptedFiles } = this.props;
    if (`.${fileExtension(file.name)}` !== acceptedFiles) {
      return alert('Неверный формат файла');
    }
    action(file);
    this.decline();
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
              <Dropzone
                acceptedFiles={acceptedFiles}
                multiple={false}
                maxFiles={1}
                onDrop={this.handleFile}
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p className="text-center">Перетащите сюда файл {acceptedFiles}</p>
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
