# iSmartyPro Utilities
Набор утилит для личной работы.

Периодически будут выполняться обновления.

# Установка
```
npm install ismartypro-utils
```

# Методы

### Проверка id в базе данных MongoDB.

Примечание:
предполагается что ваш modelFile будет расположен в папке models корня проекта

```
const iutils require("ismartypro-utils")

iutils.checkDbIds({modelFile: "user", ids: ["614f2952eb272800bb3aa3f7", "614f2952eb272800bb3aa3f0"]})
  .then((result) => {
    console.log(`Everything is ok`)
    console.log(result)
  })
  .catch(err => {
    console.log(`Some id not found`)
    console.log(err)
  })
```