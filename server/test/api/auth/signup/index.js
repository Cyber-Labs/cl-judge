const successTest = require('./signupAPISuccessTest')
const invalidUsernameTest = require('./signupAPIInvalidUsernameTest')
const invalidPasswordTest = require('./signupAPIInvalidPasswordTest')
const invalidFullnameTest = require('./signupAPIInvalidFullnameTest')
const invalidAdmissionNumberTest = require('./signupAPIInvalidAdmissionNumberTest')
const invalidEmailTest = require('./signupAPIInvalidEmailTest')
const invalidMobileTest = require('./signupAPIInvalidMobileTest')

const signupTest = () => describe('Signup API testing on Test Server', () => {
    successTest()
    invalidUsernameTest()
    invalidPasswordTest()
    invalidFullnameTest()
    invalidAdmissionNumberTest()
    invalidEmailTest()
    invalidMobileTest()
})

module.exports = signupTest
