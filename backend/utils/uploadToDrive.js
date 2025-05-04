// backend/utils/uploadToDrive.js
const fs = require('fs')
const { google } = require('googleapis')
require('dotenv').config({ path: '.env' }) // o '.env.drive' si lo separaste

const KEYFILEPATH = 'backend/google-service-account.json' // ruta a tu archivo JSON
const SCOPES = ['https://www.googleapis.com/auth/drive']

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
})

const drive = google.drive({ version: 'v3', auth })

const uploadFileToDrive = async (file) => {
    console.log('📦 Archivo recibido en uploadFileToDrive:', file)
  const fileMetadata = {
    name: file.originalname,
    parents: [process.env.DRIVE_FOLDER_ID],
  }

  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  }

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  })

  // Hacer el archivo público
  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  })

  // Eliminar el archivo local temporal
  fs.unlinkSync(file.path)

  const publicUrl = `https://drive.google.com/uc?id=${response.data.id}`
  return publicUrl
}

module.exports = uploadFileToDrive
