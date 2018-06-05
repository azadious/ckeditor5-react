'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * For licensing, see LICENSE.md.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var CKEditor = function (_React$Component) {
	_inherits(CKEditor, _React$Component);

	function CKEditor(props) {
		_classCallCheck(this, CKEditor);

		var _this = _possibleConstructorReturn(this, (CKEditor.__proto__ || Object.getPrototypeOf(CKEditor)).call(this, props));

		_this.editorInstance = null;
		return _this;
	}

	// This component should never be updated by React itself.


	_createClass(CKEditor, [{
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate() {
			return false;
		}

		// Update editor data if data property is changed.

	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(newProps) {
			if (this.editorInstance && newProps.data) {
				this.editorInstance.setData(newProps.data);
			}
		}

		// Initialize editor when component is mounted.

	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			this._initializeEditor();
		}

		// Destroy editor before unmouting component.

	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this._destroyEditor();
		}

		// Render <div> element which will be replaced by CKEditor.

	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			return _react2.default.createElement('div', { ref: function ref(_ref) {
					return _this2.domContainer = _ref;
				} });
		}
	}, {
		key: '_initializeEditor',
		value: function _initializeEditor() {
			var _this3 = this;

			this.props.editor.create(this.domContainer, this.props.config).then(function (editor) {
				_this3.editorInstance = editor;

				// TODO: Pass data via constructor.
				_this3.editorInstance.setData(_this3.props.data);

				// TODO: Add example using it.
				if (_this3.props.onInit) {
					_this3.props.onInit(editor);
				}

				if (_this3.props.onChange) {
					var document = _this3.editorInstance.model.document;
					document.on('change', function () {
						if (document.differ.getChanges().length > 0) {
							_this3.props.onChange(editor.getData());
						}
					});
				}
			}).catch(function (error) {
				console.error(error);
			});
		}
	}, {
		key: '_destroyEditor',
		value: function _destroyEditor() {
			if (this.editorInstance) {
				this.editorInstance.destroy();
			}
		}
	}]);

	return CKEditor;
}(_react2.default.Component);

// Properties definition.


exports.default = CKEditor;
CKEditor.propTypes = {
	editor: _propTypes2.default.func.isRequired,
	data: _propTypes2.default.string,
	config: _propTypes2.default.object,
	onChange: _propTypes2.default.func,
	onInit: _propTypes2.default.func
};

// Default values for non-required properties.
CKEditor.defaultProps = {
	data: '',
	config: {}
};