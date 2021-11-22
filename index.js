const fs = require('fs')
const path = require('path')


function checkDbIds (checkData){
  let { modelFile, ids } = checkData
  var appDir = path.dirname(require.main.filename)
  let path = ""
  return new Promise(async (resolve, reject) => {
    const result = {errors: []}
    try {
      if(fs.existsSync(path.join(appDir, 'models', `${modelFile}.js`))) {
        const Model = require(path.join(appDir, 'models', `${modelFile}.js`))
        if (!ids || !(ids instanceof Array)) result.errors.push('ids is not Array')
        Model.find({ "_id": ids })
          .then(response => {
            let dbIds = response.map(item => { return item._id.toString() })
            let missingIds = ids.filter(item => !dbIds.includes(item))
            missingIds.length === 0 ?
              resolve(Object.assign(result, { ok: true })) :
              reject(Object.assign(result, { ok: false, modelFile, message: 'Missing IDs', missingIds }))
          })
          .catch(err => console.log(err))
      }
    } catch(err) {
      result.errors.push('Model file not exist')
      reject(Object.assign(result, { ok: false }))
    }
    }
  )
}