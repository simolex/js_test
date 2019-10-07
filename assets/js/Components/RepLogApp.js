'use strict';

const Helper = require('./RepLogAppHelper');
const $ = require('jquery');
const swal = require('sweetalert2');
require('sweetalert2/dist/sweetalert2.css');

//(function(window, Routing) {

let HelperInstances = new WeakMap();

class RepLogApp
{
    constructor ($wrapper, initialRepLogs) {
        this.$wrapper = $wrapper;
        this.repLogs = [];

        HelperInstances.set(this, new Helper(this.repLogs));

        //this.helper = new Helper(this.$wrapper);

        //this.loadRepLogs();

        for (let repLog of initialRepLogs) {
            this._addRow(repLog);
        }

        this.$wrapper.on(
            'click',
            '.js-delete-rep-log',
            this.handleRepLogDelete.bind(this)
        );

        this.$wrapper.on(
            'click',
            'tbody tr',
            this.handleRowClick.bind(this)
        );

        this.$wrapper.on(
            'submit',
            '.js-new-rep-log-form',
            this.handleNewFormSubmit.bind(this)
        );

        this.$wrapper.on(

            RepLogApp._selectors.newRepForm,
        );
    }
/*}

$.extend(window.RepLogApp.prototype, {*/

    static get _selectors() {
        return {
            newRepForm: '.js-new-rep-log-form'
        }
    }

    _removeFormErrors() {
        const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
        $form.find('.js-field-error').remove();
        $form.find('.form-group').removeClass('has-error');
    }

    _clearForm() {
        this._removeFormErrors();

        const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
        $form[0].reset();
    }

    _mapErrorsToForm(errorData) {
        this._removeFormErrors();
        const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);

        //$form.find('.js-field-error').remove();
        //$form.find('.form-group').removeClass('has-error');

        //$form.find(':input').each( (index, element) => {
        for (let element of $form.find(':input')) {
            const fieldName = $(element).attr('name');
            const $wrapper = $(element).closest('.form-group');
            if (!errorData[fieldName]) {
                // no error!
                return;
            }

            const $error = $('<span class="js-field-error help-block"></span>');
            $error.html(errorData[fieldName]);
            $wrapper.append($error);
            $wrapper.addClass('has-error');
        }
        //});
    }

    _addRow(repLog) {
        this.repLogs.push(repLog);
        //let {id, itemLabel, reps, totallyMadeUpKey = 'whatever!'} = repLog;
        //console.log(id, itemLabel, reps, totallyMadeUpKey);

        //const tplText = $('#js-rep-log-row-template').html();
        //const tpl = _.template(tplText);

        const html = rowTemplate(repLog);
        const $row = $($.parseHTML(html));
        // store the repLogs index
        $row.data('key', this.repLogs.length - 1);
        this.$wrapper.find('tbody').append($row);

        this.updateTotalWeightLifted();
    }

    _saveRepLog(data) {
        return new Promise( (resolve, reject) => {
            const url = Routing.generate('rep_log_new');
            $.ajax({
                url: url,
                method: 'POST',
                data: JSON.stringify(data)
            }).then( (data, textStatus, jqXHR) => {
                // $.ajax({
                // });
                $.ajax({
                    url: jqXHR.getResponseHeader('Location')
                }).then( (data) => {
                    // we're finally done!
                    resolve(data);
                }).catch( (jqXHR) => {
                    reject(jqXHR);
                });
            }).catch( (jqXHR) => {
                const errorData = JSON.parse(jqXHR.responseText);
                reject(errorData);
            });
        });
    }

    /*loadRepLogs() {
        $.ajax({
            url: Routing.generate('rep_log_list')
        }).then((data) => {
            //.each(data.items, (key, repLog) => {
            for (let repLog of data.items) {
                this._addRow(repLog);
            }
            //});
            //console.log(this.repLogs, this.repLogs.includes(data.items[0]));
        })
    }*/

    handleNewFormSubmit(e) {
        e.preventDefault();
        const $form = $(e.currentTarget);
        const formData = {};
        //$.each($form.serializeArray(), (key, fieldData) => {
        for (let fieldData of $form.serializeArray()) {
            formData[fieldData.name] = fieldData.value;
        }
        //});

        this._saveRepLog(formData)
            .then((data) => {
                this._clearForm();
                this._addRow(data);
            }).catch( (jqXHR) => {
                //var errorData = JSON.parse(jqXHR.responseText);
                this._mapErrorsToForm(errorData.errors);
            });
        //console.log('submitting!');
    }

    updateTotalWeightLifted() {
        this.$wrapper.find('.js-total-weight').html(
            HelperInstances.get(this).getTotalWeightString()
        );
    }

    handleRepLogDelete(e) {
        e.preventDefault();
        const $link = $(e.currentTarget);

        swal({
            title: 'Delete this log?',
            text: 'What? Did you not actually lift this?',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return this._deleteRepLog($link);
            }
        }).catch((arg) => {
            // canceling is cool!
            //console.log('canceled', arg);
        });
    }

    _deleteRepLog($link) {
        $link.addClass('text-danger');
        $link.find('.fa')
            .removeClass('fa-trash')
            .addClass('fa-spinner')
            .addClass('fa-spin');

        const deleteUrl = $link.data('url');
        const $row = $link.closest('tr');

        return $.ajax({
            url: deleteUrl,
            method: 'DELETE'
        }).then( () => {
            $row.fadeOut('normal',  () => {
                // we need to remove the repLog from this.repLogs
                // the "key" is the index to this repLog on this.repLogs
                this.repLogs.splice(
                    $row.data('key'),
                    1
                );

                $row.remove();

                this.updateTotalWeightLifted();
            });
        });
    }

    handleRowClick() {
        console.log('row clicked!');
    }
}



/*function upper(template, ...expressions) {
    return template.reduce((accumulator, part, i) => {
        return accumulator + (expressions[i - 1].toUpperCase ? expressions[i - 1].toUpperCase() : expressions[i - 1]) + part
    })
}*/

//const rowTemplate = (repLog) => upper`
const rowTemplate = (repLog) => `
    <tr data-weight="${ repLog.totalWeightLifted }">
        <td>${ repLog.itemLabel }</td>
        <td>${ repLog.reps }</td>
        <td>${ repLog.totalWeightLifted }</td>
        <td>
            <a href="#"
               class="js-delete-rep-log"
               data-url="${ repLog.links._self }"
            >
                <span class="fa fa-trash"></span>
            </a>
        </td>
    </tr>
`;

module.exports = RepLogApp;
//window.RepLogApp = RepLogApp;
//})(window, Routing);