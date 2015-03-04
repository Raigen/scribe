define(function () {

  'use strict';

  return function () {
    return function (scribe) {
      var underlineCommand = new scribe.api.CommandPatch('underline');

      underlineCommand.queryState = function () {
        var selection = new scribe.api.Selection();
        var underlineElement = selection.getContaining(function (element) {
          return element.nodeName === 'U';
        });
        return scribe.api.CommandPatch.prototype.queryState.apply(this, arguments) && underlineElement;
      };

      scribe.commandPatches.underline = underlineCommand;
    };
  };
});
