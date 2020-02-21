'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var styled = _interopDefault(require('styled-components'));

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  color: red;\n  font-size: 30px;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}
var StyledSwitch = styled.div(_templateObject());

var Switch = function Switch() {
  return React.createElement(StyledSwitch, null, "npm init");
};

function _templateObject$1() {
  var data = _taggedTemplateLiteral(["\n  color: purple;\n"]);

  _templateObject$1 = function _templateObject() {
    return data;
  };

  return data;
}
var StyledButton = styled.button(_templateObject$1());

var Button = function Button() {
  return React.createElement(StyledButton, null, "npm init");
};

exports.Button = Button;
exports.Switch = Switch;
