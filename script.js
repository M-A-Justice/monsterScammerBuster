require('dotenv').config();
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const path = './fakeData.csv';
const { URL } = process.env;
const {
  name,
  internet,
  address,
  phone
} = require('faker');
const { parentPort } = require("worker_threads");

const firstName = name.firstName();
const lastName = name.lastName();
const streetAddress = address.streetAddress();
const city = address.city();
const state = address.state();
const zip = `${address.zipCodeByState(state)}`;
const country = 'USA';
const number = phone.phoneNumberFormat();
const email = internet.email();

const toWrite = `${firstName}, ${lastName}, ${streetAddress}, ${city}, ${state}, ${zip}, ${country}, ${number}, ${email}\n`;

fs.writeFileSync(path, toWrite, {flag: 'a+'});

const data = {
  '_u760030307310647658[first]': firstName,
  '_u760030307310647658[last]': lastName,
  '_u399412028115086886[line1]': streetAddress,
  '_u399412028115086886[line2]': '',
  '_u399412028115086886[city]': city,
  '_u399412028115086886[state]': state,
  '_u399412028115086886[zip]': zip,
  '_u399412028115086886[country]': country,
  '_u760063101376665589[number]': number,
  '_u342055658340617828': email,
  'ucfid': '926620119829350723',
  'form_version': '2',
  'wsite_approved': 'approved',
};

const form = new FormData();

for (let key in data) {
  form.append(key, data[key]);
}

axios.post(URL, form, {
  headers: form.getHeaders()
})
  .then((response) => {
    if (typeof response.data === 'string' && response.data.includes('Thank you. Your information has been submitted.')) {
      parentPort.postMessage('Thread Success');
    } else {
      parentPort.postMessage('Failed thread');
    }
  })
  .catch((response) => {
    console.log(`Failure`, response);
  });
