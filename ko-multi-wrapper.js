// ko-multi-wrapper.js
// Copyright (c) 2012, Eric Panorel
// License: MIT (http://www.opensource.org/licenses/mit-license.php)
//
// Knockout binding for Eric Hynd's jQuery UI MultiSelect Widget
//
// http://www.erichynds.com/jquery/jquery-ui-multiselect-widget/
//
// This binding wraps the standard 'options' binding for SELECT
// html element, with mutiple attribute (multi-select).
// Examples:
//   <select data-bind="multiSelectCheck: listOfObjects, optionsCaption: 'Check one or more', selectedOptions: selectedRec, optionsText: 'Key'"  multiple="multiple"></select>
//   <select data-bind="multiSelectCheck: listOfString, optionsCaption: 'Check one or more', selectedOptions: selectedRec"  multiple="multiple"></select>
(function (ko, $) {

    if (typeof (ko) === undefined) { throw 'Knockout is required, please ensure it is loaded before loading this plug-in'; }
    if (typeof (jQuery) === undefined) { throw 'jQuery is required, please ensure it is loaded before loading this plug-in'; }
    if (typeof (jQuery.ui) === undefined) { throw 'jQuery UI is required, please ensure it is loaded before loading this plug-in'; }

    // private functions here

    // the binding
    ko.bindingHandlers.multiSelectCheck = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            // This will be called when the binding is first applied to an element
            // Set up any initial state, event handlers, etc. here
            var multiselectOptions = ko.utils.unwrapObservable(allBindingsAccessor().multiselectOptions) || {};

            // pass the original optionsCaption to the similar widget option
            if (ko.utils.unwrapObservable(allBindingsAccessor().optionsCaption)) {
                multiselectOptions.noneSelectedText = ko.utils.unwrapObservable(allBindingsAccessor().optionsCaption);
            }

            // remove this and use the widget's
            allBindingsAccessor().optionsCaption = '';
            $(element).multiselect(multiselectOptions);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).multiselect("destroy");
            });

        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            // This will be called once when the binding is first applied to an element,
            // and again whenever the associated observable changes value.
            // Update the DOM element based on the supplied values here.
            var selectOptions = ko.utils.unwrapObservable(allBindingsAccessor().multiSelectCheck);
            // remove this and use the widget's 
            allBindingsAccessor().optionsCaption = '';

            ko.bindingHandlers.options.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);

            // get what are the selected checkboxes
            var array_of_checked_values = $(element).multiselect("getChecked").map(function () {
                return this.title;
            }).get();

            var selOptionsBinding = allBindingsAccessor().selectedOptions;
            var optionsText = ko.utils.unwrapObservable(allBindingsAccessor().optionsText);

            var optionsTextIsFunction = typeof optionsText === 'function';

            var propertyToCompare = optionsText ? optionsText : undefined;

            var selectedOptions = [];

            ko.utils.arrayForEach(array_of_checked_values, function (title) {
                ko.utils.arrayForEach(selectOptions, function (item) {
                    if (typeof (propertyToCompare) != 'undefined') {
                        if (typeof optionsText === 'function') {
                           
                            if (optionsText(item) == title) {
                                selectedOptions.push(item);
                            }
                        } else {

                            if (item[propertyToCompare] == title) {
                                selectedOptions.push(item);
                            }
                        }
                    }
                    else {
                        if (item == title) {
                            selectedOptions.push(item);
                        }

                    }

                });
            });

            // override the ko binding with these results
            if (ko.isObservable(selOptionsBinding)) {
                selOptionsBinding(selectedOptions);
            } else {
                selOptionsBinding = selectedOptions;
            }

            setTimeout(function () {
                $(element).multiselect("refresh");
            }, 0);

        }

    };

})(ko, jQuery);