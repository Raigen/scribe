#Plugin API

## Commands
Commands are implemented in the javascript Web API and executed on the current selection with `document.execCommand`.
There are other methods to get value and state of the current commands. `document.queryCommandState` and `document.queryCommandValue`.

### The most important methods of the [HTML Editing APIs][1]
```javascript
/**
 * execute a manipulation to content of the editable region
 *
 * @param {String}  commandName name of the Command
 * @param {Boolean} showDefaultUI show default user interface
 * @param {String}  valueArgument argument for commands requiring this (like `insertimage` requires the image's url)
 *
 * @returns {Boolean} indicate if the command was executed successfully
 */
document.execCommand(aCommandName, aShowDefaultUI, aValueArgument);

/**
 * check if the given command is already active for the current selection
 * also checks if the given command is not supported
 *
 * @param {String}  commandName name of the Command
 *
 * @returns {Boolean} wether the command's state is not supported, not active or active
 */
document.queryCommandState(aCommandName);

/**
 * get the current value for the given command
 * for example the fontname of the current selection for the command `fontname`
 *
 * @param {String}  commandName name of the Command
 *
 * @returns {Boolean|String} current value of the command or `false` if there is no value
 */
document.queryCommandValue(aCommandName);
```

### Scribe Commands
Scribe is mapping the method into it's own command api `scribe.api.Command`, `scribe.api.SimpleCommand`, `scribe.api.CommandPatch`.
Thanks to this api we can not only overwrite or patch native commands but we can also create own commands and use them the same way.
And everything with simple and short plugins.

The native implementation of the underline `queryCommandState` checks wether the selection is getting a style of `text-decoration: underline`.
This also returns `true` for links which are underlined at default. We now want to change this behavior in a little Scribe plugin.
```javascript
var underlineCommand = new scribe.api.CommandPatch('underline');
```
This is creating a patch wrapper for the bold-command every modern browser has implemented. From this on we can overwrite serveral methods.
Like the `queryState` in the following example:
```javascript
// overwrite scribe's mapping to the native `queryCommandState`
underlineCommand.queryState = function () {
  // get the current selection
  var selection = new scribe.api.Selection();
  // get the containing elements and query them
  var underlineElement = selection.getContaining(function (element) {
    return element.nodeName === 'U';
  });
  // first check wether the native query would give positive result and then extend it with our own result
  return scribe.api.CommandPatch.prototype.queryState.apply(this, arguments) && underlineElement;
};
```

## Reference
[HTML Editing APIs][1]

[MDN Document.execCommand][2] (with list of available commands)

  [1]: https://dvcs.w3.org/hg/editing/raw-file/tip/editing.html#execcommand()
  [2]: https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand
