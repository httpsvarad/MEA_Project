export function isApiValid(key) {
    if (process.env.API_KEY === key){
        return true
    } else {
        return false
    }
}