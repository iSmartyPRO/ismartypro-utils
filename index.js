const { I18n } = require('i18n')
const path = require('path')

const i18n = new I18n()
i18n.configure({
  locales: ['ru', 'en', 'tr'],
  directory: path.join(__dirname, 'locales'),
  fallbacks: {
    nl: 'ru',
    'en-*': 'en',
    'tr-*': 'tr',
  },
  defaultLocale: 'ru',
})


module.exports.chekOid = (str) => {
  // Check object Id
  let checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
  return checkForHexRegExp.test(str) ? true : false
}

module.exports.checkDbIds = (checkData) => {
  return new Promise(async (resolve, reject) => {
    const fs = require('fs')
    const path = require('path')
    const result = { errors: [] }
    let { modelFile, ids, locale } = checkData
    locale = locale ? locale : 'ru'
    i18n.setLocale(locale)
    if (!ids || !(ids.constructor.name === 'Array')) {
      result.errors.push('ids is not Array')
      return reject(Object.assign(result, { ok: false }))
    }
    var appDir = path.dirname(require.main.filename)
    for (let i = 0; i < ids.length; i++) {
      if (!this.chekOid(ids[i])) {
        result.errors.push(i18n.__('error.incorrectId', { id: ids[i] }))
        return reject(Object.assign(result, { ok: false }))
      }
    }
    try {
      if (fs.existsSync(path.join(appDir, 'models', `${modelFile}.js`))) {
        const Model = require(path.join(appDir, 'models', `${modelFile}.js`))
        Model.find({ "_id": ids })
          .then(response => {
            let dbIds = response.map(item => { return item._id.toString() })
            let missingIds = ids.filter(item => !dbIds.includes(item))
            if (missingIds.length === 0) {
              resolve(Object.assign(result, { ok: true }))
            } else {
              result.errors.push(i18n.__('error.notFoundIds', {modelFile, missingIds: missingIds.join(',')}))
              reject(Object.assign(result, { ok: false }))
            }

          })
          .catch(error => {
            result.errors.push(i18n.__("error.monggose", { error }))
            reject(Object.assign(result, { ok: false }))
          })
      } else {
        result.errors.push(i18n.__('error.modelNotFound'))
        reject(Object.assign(result, { ok: false }))
      }
    } catch (err) {
      result.errors.push(i18n.__('error.modelNotExist'))
      reject(Object.assign(result, { ok: false }))
    }
  }
  )
}