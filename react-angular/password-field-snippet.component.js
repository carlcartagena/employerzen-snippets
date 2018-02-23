(function () {

    angular.module('client.components')
        .component('passwordField', {
            templateUrl: 'client/components/password-field/password-field.component.html',
            bindings: {
                passwordInputField: '&',
                form: '<',
                resetPasswordField: '<',
                resetConfirmPasswordField: '<'
            },
            controller: passwordFieldComponentController
        })

    passwordFieldComponentController.$inject = ['toastr']

    function passwordFieldComponentController(toastr) {
        let $ctrl = this
        $ctrl.$onChanges = function () {
            $ctrl.passwordComponent = $ctrl.resetPasswordField
            $ctrl.confirmPasswordComponent = $ctrl.resetConfirmPasswordField
        }
    }
}())