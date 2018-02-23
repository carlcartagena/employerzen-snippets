(function () {
    'use strict'

    angular.module('client.leads')
        .controller('leadListController', LeadListController)

    LeadListController.$inject = ['leadService', 'leads', '$log', '$filter']

    function LeadListController(leadService, leads, $log, $filter) {

        var vm = this

        vm.delete = _delete
        vm.currentPage = 1
        vm.itemsPerPage = 10
        vm.pageChange = _pageChange
        vm.selectedId = null
        vm.setId = _setId
        vm.$onInit = init

        vm.onSelectLead = _onSelectLead

        function init() {
            vm.leads = leads
            vm.searchResults = $filter('filter')(vm.leads, vm.searchFilter)
            vm.searchResultsPageData = $filter('limitTo')(vm.searchResults, vm.itemsPerPage)
        }

        function _delete(id) {
            leadService.delete(id)
                .then(data => {
                    let removeIndex = vm.leads.findIndex(elm => elm._id === id)
                    vm.leads.splice(removeIndex, 1)
                    _pageChange()
                })
                .catch(err => $log.log(`Error: ${data.errors}`))
        }

        function _setId(id) {
            vm.selectedId = id
        }

        function _onSelectLead(leadId) {
            console.log(leadId)
        }

        function _pageChange() {
            vm.searchResults = $filter('filter')(vm.leads, vm.searchFilter)
            vm.searchResultsPageData = $filter('limitTo')(vm.searchResults, vm.itemsPerPage)
            let searchResultsArray = vm.searchResults
            let itemsPerPage = vm.itemsPerPage
            let sliceParam1 = (vm.currentPage - 1) * itemsPerPage
            let sliceParam2 = (vm.currentPage * itemsPerPage)
            let pagedData = searchResultsArray.slice(sliceParam1, sliceParam2)
            vm.searchResultsPageData = pagedData
        }
    }
})()