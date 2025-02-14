export const firebaseSnapToJson = (doc = {}) => {
    Object.entries(doc).reduce((previouseValue, item, index) => {
        if(isObject(doc[item])){
            previouseValue[item] = firebaseSnapToJson(item)
        }
    },{})
}

function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }