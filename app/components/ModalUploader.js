import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Dropzone from 'react-dropzone';
import XLSX from 'xlsx';

type Props = {
  buttonLabel: string,
  title: string,
  acceptedFiles: string
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
    const rABS = true;
    const { file } = this.state;
    console.log(file);
    const reader = new FileReader();
    reader.onload = f => {
      let data = f.target.result;
      console.log('data', data);
      if (!rABS) data = new Uint8Array(data);
      const workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
      // const json = XLSX.utils.sheet_to_json(workbook, { raw: true });
      const ws = workbook.Sheets['Лист1'];
      const json = XLSX.utils.sheet_to_json(ws, {
        header: [
          'id',
          'family',
          'name',
          'patronymic',
          'birthday',
          'position',
          'registryType',
          'taxpayerNumber'
        ]
      });
      console.log(json.slice(1));
      /* DO SOMETHING WITH workbook HERE */
    };
    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  render() {
    const { buttonLabel, title, acceptedFiles } = this.props;
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
                      <p className="text-center">Перетащите сюда файл</p>
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
