import Excel from 'exceljs';
import electron from 'electron';
import _ from 'lodash';
import { getLastPeriod } from '../components/referenceTail';

export const createTable = (users, references) => {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('My Sheet');

  worksheet.columns = [
    { header: '№\nМО', key: 'regionId', width: 5 },
    {
      header: 'Наименование\nмуниципального образования',
      key: 'region',
      width: 50
    },
    { header: 'Фамилия', key: 'lastName', width: 15 },
    { header: 'Имя', key: 'name', width: 15 },
    { header: 'Отчество', key: 'patronymic', width: 15 },
    { header: 'Должность', key: 'position', width: 25 },
    { header: 'Год предоставления', key: 'year', width: 25 }
  ];
  users.forEach(el => {
    const [lastPeriod, hasPeriod] = getLastPeriod(el.id, references);
    worksheet.addRow({
      ...el,
      name: _.startCase(el.name),
      lastName: _.startCase(el.lastName),
      patronymic: _.startCase(el.patronymic),
      year: hasPeriod ? lastPeriod : ''
    });
  });
  worksheet.autoFilter = `A1:G${users.length + 1}`;

  const desktopPath = electron.remote.app.getPath('desktop');
  const userChosenPath = electron.remote.dialog.showSaveDialog({
    defaultPath: `${desktopPath}/реестр_${new Date().toLocaleDateString(
      'ru-RU'
    )}.xlsx`
  });
  if (userChosenPath) {
    workbook.xlsx
      .writeFile(userChosenPath)
      .then(e => console.log(e))
      .catch(e => console.log(e));
  }
};
