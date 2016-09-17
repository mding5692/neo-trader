/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';

	var phosphide = __webpack_require__(1);

	var app = new phosphide.Application({
	  extensions: [
	    __webpack_require__(66).commandPaletteExtension,
	    __webpack_require__(67).blueExtension,
	    __webpack_require__(68).greenExtension,
	    __webpack_require__(69).redExtension,
	    __webpack_require__(70).yellowExtension,
	    __webpack_require__(71).editorExtension
	  ]
	});


	window.onload = function() {
	  app.run().then(function () {

	    app.shortcuts.add([
	      {
	        command: 'command-palette:toggle',
	        sequence: ['Accel Shift P'],
	        selector: '*'
	      },
	      {
	        command: 'command-palette:hide',
	        sequence: ['Escape'],
	        selector: '[data-left-area="command-palette"]'
	      }
	    ]);

	  });
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	var applicationshell_1 = __webpack_require__(2);
	var extensionregistry_1 = __webpack_require__(50);
	var serviceregistry_1 = __webpack_require__(51);
	var commandregistry_1 = __webpack_require__(52);
	var paletteregistry_1 = __webpack_require__(53);
	var shortcutregistry_1 = __webpack_require__(61);
	/**
	 * A class which provides the main Phosphide application logic.
	 *
	 * A phosphide application manages the registration of services and
	 * extensions, and provides the top-level application shell widget.
	 */
	var Application = (function () {
	    /**
	     * Construct a new application.
	     *
	     * @param options - The options for initializing the application.
	     */
	    function Application(options) {
	        this._started = false;
	        this._promise = null;
	        this._shell = null;
	        this._commands = null;
	        this._palette = null;
	        this._shortcuts = null;
	        this._services = new serviceregistry_1.ServiceRegistry();
	        this._extensions = new extensionregistry_1.ExtensionRegistry();
	        if (options)
	            Private.initFrom(this, options);
	    }
	    Object.defineProperty(Application.prototype, "shell", {
	        /**
	         * Get the application shell widget.
	         *
	         * #### Notes
	         * The shell widget is not a service, and can only be accessed as a
	         * property of the application. Since the application object is not
	         * passed to service providers, services do not have access to the
	         * shell. This is by design. The intent is to encourage authors to
	         * maintain a distinct separation between generic services and the
	         * application extensions which manipulates the UI.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._shell;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Application.prototype, "commands", {
	        /**
	         * Get the application command registry.
	         *
	         * #### Notes
	         * The command registry is a service, and is provided as a property
	         * for the convenience of application extension authors. A service
	         * provider may require the command registry as needed.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._commands;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Application.prototype, "palette", {
	        /**
	         * Get the application palette registry.
	         *
	         * #### Notes
	         * The palette registry is a service, and is provided as a property
	         * for the convenience of application extension authors. A service
	         * provider may require the palette registry as needed.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._palette;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Application.prototype, "shortcuts", {
	        /**
	         * Get the application shortcut registry.
	         *
	         * #### Notes
	         * The shortcut registry is a service, and is provided as a property
	         * for the convenience of application extension authors. A service
	         * provider may require the shortcut registry as needed.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._shortcuts;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Register a service provider with the application.
	     *
	     * @param provider - The service provider to register.
	     *
	     * #### Notes
	     * An error will be thrown if a provider with the same id is already
	     * registered, if a provider which provides the identical service is
	     * already registered, or if the provider has a circular dependency.
	     */
	    Application.prototype.registerProvider = function (provider) {
	        this._services.registerProvider(provider);
	    };
	    /**
	     * List the IDs of all service providers in the application.
	     *
	     * @returns A new array of all provider IDs in the application.
	     */
	    Application.prototype.listProviders = function () {
	        return this._services.listProviders();
	    };
	    /**
	     * Test whether the application has a registered service provider.
	     *
	     * @param id - The id of the provider of interest.
	     *
	     * @returns `true` if a service provider with the specified id is
	     *   registered, `false` otherwise.
	     */
	    Application.prototype.hasProvider = function (id) {
	        return this._services.hasProvider(id);
	    };
	    /**
	     * Test whether the application has a provider for a service type.
	     *
	     * @param kind - The type of the service of interest.
	     *
	     * @returns `true` if a service provider is registered for the
	     *   given service type, `false` otherwise.
	     */
	    Application.prototype.hasProviderFor = function (kind) {
	        return this._services.hasProviderFor(kind);
	    };
	    /**
	     * Resolve a service implementation for the given type.
	     *
	     * @param kind - The type of service object to resolve.
	     *
	     * @returns A promise which resolves the specified service type,
	     *   or rejects with an error if it cannot be satisfied.
	     *
	     * #### Notes
	     * Services are singletons. The same service instance will be
	     * returned each time a given service type is resolved.
	     *
	     * User code will not normally call this method directly. Instead
	     * the required services for the user's providers and extensions
	     * will be resolved automatically as needed.
	     */
	    Application.prototype.resolveService = function (kind) {
	        return this._services.resolveService(kind);
	    };
	    /**
	     * Register an extension with the application.
	     *
	     * @param extension - The application extension to register.
	     *
	     * #### Notes
	     * An error will be thrown if the extension id is already registered.
	     */
	    Application.prototype.registerExtension = function (extension) {
	        this._extensions.registerExtension(extension);
	    };
	    /**
	     * List the IDs of all extensions in the application.
	     *
	     * @returns A new array of all extension IDs in the application.
	     */
	    Application.prototype.listExtensions = function () {
	        return this._extensions.listExtensions();
	    };
	    /**
	     * Test whether the application has a registered extension.
	     *
	     * @param id - The id of the extension of interest.
	     *
	     * @returns `true` if an application extension with the specified
	     *   id is registered, `false` otherwise.
	     */
	    Application.prototype.hasExtension = function (id) {
	        return this._extensions.hasExtension(id);
	    };
	    /**
	     * Activate the application extension with the given id.
	     *
	     * @param id - The ID of the extension of interest.
	     *
	     * @returns A promise which resolves when the extension is fully
	     *   activated or rejects with an error if it cannot be activated.
	     */
	    Application.prototype.activateExtension = function (id) {
	        return this._extensions.activateExtension(id, this, this._services);
	    };
	    /**
	     * Run the bootstrapping process for the application.
	     *
	     * @param options - The options for bootstrapping the application.
	     *
	     * @returns A promise which resolves when all bootstrapping work
	     *   is complete and the shell is mounted to the DOM, or rejects
	     *   with an error if the bootstrapping process fails.
	     *
	     * #### Notes
	     * This should be called once by the application creator after all
	     * initial providers and extensions have been registered.
	     *
	     * Bootstrapping the application consists of the following steps:
	     * 1. Create the application shell
	     * 2. Register the default providers
	     * 3. Register the default extensions
	     * 4. Resolve the application services
	     * 5. Activate the initial extensions
	     * 6. Attach the shell widget to the DOM
	     * 7. Add the application event listeners
	     */
	    Application.prototype.run = function (options) {
	        var _this = this;
	        if (options === void 0) { options = {}; }
	        // Resolve immediately if the application is already started.
	        if (this._started) {
	            return Promise.resolve();
	        }
	        // Return the pending bootstrapping promise if it exists.
	        if (this._promise) {
	            return this._promise;
	        }
	        // Create the application shell.
	        this._shell = this.createApplicationShell();
	        // Register the default providers.
	        this.registerDefaultProviders();
	        // Register the default extensions.
	        this.registerDefaultExtensions();
	        // Resolve the application services.
	        var promises = [
	            this.resolveService(commandregistry_1.ABCCommandRegistry),
	            this.resolveService(paletteregistry_1.ABCPaletteRegistry),
	            this.resolveService(shortcutregistry_1.ABCShortcutRegistry)
	        ];
	        // Setup the promise for the rest of the bootstrapping.
	        this._promise = Promise.all(promises).then(function (results) {
	            // Store the resolved default services.
	            _this._commands = results[0];
	            _this._palette = results[1];
	            _this._shortcuts = results[2];
	            // Compute the extension ids to activate.
	            var extIDs;
	            var optVal = options.activateExtensions;
	            if (optVal === true) {
	                extIDs = _this.listExtensions();
	            }
	            else if (optVal === false) {
	                extIDs = [];
	            }
	            else if (optVal) {
	                extIDs = optVal;
	            }
	            else {
	                extIDs = _this.listExtensions();
	            }
	            // Activate the initial extensions.
	            return Promise.all(extIDs.map(function (id) { return _this.activateExtension(id); }));
	        }).then(function () {
	            // Mark the application as started and clear the stored promise.
	            _this._promise = null;
	            _this._started = true;
	            // Compute the id of the shell host node.
	            var shellHostID = options.shellHostID || '';
	            // Attach the application shell to the host node.
	            _this.attachApplicationShell(shellHostID);
	            // Add the application event listeners.
	            _this.addEventsListeners();
	        }).catch(function (error) {
	            // Clear the stored promise.
	            _this._promise = null;
	            // Rethrow the error to reject the promise.
	            throw error;
	        });
	        // Return the pending bootstrapping promise.
	        return this._promise;
	    };
	    /**
	     * Handle the DOM events for the application.
	     *
	     * @param event - The DOM event sent to the application.
	     *
	     * #### Notes
	     * This method implements the DOM `EventListener` interface and is
	     * called in response to events registered for the application. It
	     * should not be called directly by user code.
	     */
	    Application.prototype.handleEvent = function (event) {
	        switch (event.type) {
	            case 'resize':
	                this.evtResize(event);
	                break;
	            case 'keydown':
	                this.evtKeydown(event);
	                break;
	        }
	    };
	    /**
	     * Create the shell widget for the application.
	     *
	     * @returns An instance of an application shell.
	     *
	     * #### Notes
	     * A subclass may reimplement this this method for a custom shell.
	     */
	    Application.prototype.createApplicationShell = function () {
	        return new applicationshell_1.ApplicationShell();
	    };
	    /**
	     * Register the default service providers for the application.
	     *
	     * #### Notes
	     * The default implementation of this method registers default
	     * providers for the `ABCCommandRegistry`, `ABCPaletteRegistry`,
	     * and `ABCShortcutRegistry` services, unless providers for these
	     * services have already been registered.
	     *
	     * A subclass may reimplement this this method to register custom
	     * default providers, but it should ensure that providers for the
	     * default services are also registered.
	     */
	    Application.prototype.registerDefaultProviders = function () {
	        if (!this.hasProviderFor(commandregistry_1.ABCCommandRegistry)) {
	            this.registerProvider(commandregistry_1.commandRegistryProvider);
	        }
	        if (!this.hasProviderFor(shortcutregistry_1.ABCShortcutRegistry)) {
	            this.registerProvider(shortcutregistry_1.shortcutRegistryProvider);
	        }
	        if (!this.hasProviderFor(paletteregistry_1.ABCPaletteRegistry)) {
	            this.registerProvider(paletteregistry_1.paletteRegistryProvider);
	        }
	    };
	    /**
	     * Register the default extensions for the application.
	     *
	     * #### Notes
	     * The default implementation of this method is a no-op.
	     *
	     * A subclass may reimplement this method as needed.
	     */
	    Application.prototype.registerDefaultExtensions = function () { };
	    /**
	     * Attach the application shell to the DOM.
	     *
	     * @param id - The id of the host node for shell, or `''`.
	     *
	     * #### Notes
	     * If the id is not provided, the document body will be the host.
	     *
	     * A subclass may reimplement this method for custom attachment.
	     */
	    Application.prototype.attachApplicationShell = function (id) {
	        this._shell.attach(id ? document.getElementById(id) : document.body);
	    };
	    /**
	     * Add the application event listeners.
	     *
	     * #### Notes
	     * The default implementation of this method listens for `'resize'`
	     * and `'keydown'` events.
	     *
	     * A subclass may reimplement this method as needed.
	     */
	    Application.prototype.addEventsListeners = function () {
	        document.addEventListener('keydown', this);
	        window.addEventListener('resize', this);
	    };
	    /**
	     * A method invoked on a document `'resize'` event.
	     *
	     * #### Notes
	     * The default implementation of this method updates the shell.
	     *
	     * A subclass may reimplement this method as needed.
	     */
	    Application.prototype.evtResize = function (event) {
	        this._shell.update();
	    };
	    /**
	     * A method invoked on a document `'keydown'` event.
	     *
	     * #### Notes
	     * The default implementation of this method invokes the key-down
	     * processing method of the shortcut manager.
	     *
	     * A subclass may reimplement this method as needed.
	     */
	    Application.prototype.evtKeydown = function (event) {
	        this._shortcuts.processKeydownEvent(event);
	    };
	    return Application;
	}());
	exports.Application = Application;
	/**
	 * The namespace for the application private data.
	 */
	var Private;
	(function (Private) {
	    /**
	     * Initialize an application with the given options object.
	     */
	    function initFrom(app, options) {
	        var providers = options.providers || [];
	        var extensions = options.extensions || [];
	        providers.forEach(function (p) { app.registerProvider(p); });
	        extensions.forEach(function (e) { app.registerExtension(e); });
	    }
	    Private.initFrom = initFrom;
	})(Private || (Private = {}));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	var arrays = __webpack_require__(3);
	var phosphor_boxpanel_1 = __webpack_require__(4);
	var phosphor_dockpanel_1 = __webpack_require__(30);
	var phosphor_panel_1 = __webpack_require__(18);
	var phosphor_splitpanel_1 = __webpack_require__(32);
	var phosphor_stackedpanel_1 = __webpack_require__(37);
	var phosphor_widget_1 = __webpack_require__(20);
	var sidebar_1 = __webpack_require__(47);
	/**
	 * The class name added to AppShell instances.
	 */
	var APPLICATION_SHELL_CLASS = 'p-ApplicationShell';
	/**
	 *
	 */
	var ApplicationShell = (function (_super) {
	    __extends(ApplicationShell, _super);
	    /**
	     * Construct a new application shell.
	     */
	    function ApplicationShell() {
	        _super.call(this);
	        this.addClass(APPLICATION_SHELL_CLASS);
	        var topPanel = new phosphor_panel_1.Panel();
	        var hboxPanel = new phosphor_boxpanel_1.BoxPanel();
	        var dockPanel = new phosphor_dockpanel_1.DockPanel();
	        var hsplitPanel = new phosphor_splitpanel_1.SplitPanel();
	        var leftHandler = new SideBarHandler('left');
	        var rightHandler = new SideBarHandler('right');
	        var rootLayout = new phosphor_boxpanel_1.BoxLayout();
	        this._topPanel = topPanel;
	        this._hboxPanel = hboxPanel;
	        this._dockPanel = dockPanel;
	        this._hsplitPanel = hsplitPanel;
	        this._leftHandler = leftHandler;
	        this._rightHandler = rightHandler;
	        // TODO fix these
	        topPanel.id = 'p-top-panel';
	        hsplitPanel.id = 'p-main-split-panel';
	        leftHandler.sideBar.addClass('p-mod-left');
	        rightHandler.sideBar.addClass('p-mod-right');
	        leftHandler.stackedPanel.id = 'p-left-stack';
	        rightHandler.stackedPanel.id = 'p-right-stack';
	        dockPanel.id = 'p-main-dock-panel';
	        dockPanel.spacing = 8; // TODO make this configurable?
	        hsplitPanel.orientation = phosphor_splitpanel_1.SplitPanel.Horizontal;
	        hsplitPanel.spacing = 1; // TODO make this configurable?
	        phosphor_splitpanel_1.SplitPanel.setStretch(leftHandler.stackedPanel, 0);
	        phosphor_splitpanel_1.SplitPanel.setStretch(dockPanel, 1);
	        phosphor_splitpanel_1.SplitPanel.setStretch(rightHandler.stackedPanel, 0);
	        hsplitPanel.addChild(leftHandler.stackedPanel);
	        hsplitPanel.addChild(dockPanel);
	        hsplitPanel.addChild(rightHandler.stackedPanel);
	        hboxPanel.direction = phosphor_boxpanel_1.BoxPanel.LeftToRight;
	        hboxPanel.spacing = 0; // TODO make this configurable?
	        phosphor_boxpanel_1.BoxPanel.setStretch(leftHandler.sideBar, 0);
	        phosphor_boxpanel_1.BoxPanel.setStretch(hsplitPanel, 1);
	        phosphor_boxpanel_1.BoxPanel.setStretch(rightHandler.sideBar, 0);
	        hboxPanel.addChild(leftHandler.sideBar);
	        hboxPanel.addChild(hsplitPanel);
	        hboxPanel.addChild(rightHandler.sideBar);
	        rootLayout.direction = phosphor_boxpanel_1.BoxLayout.TopToBottom;
	        rootLayout.spacing = 0; // TODO make this configurable?
	        phosphor_boxpanel_1.BoxLayout.setStretch(topPanel, 0);
	        phosphor_boxpanel_1.BoxLayout.setStretch(hboxPanel, 1);
	        rootLayout.addChild(topPanel);
	        rootLayout.addChild(hboxPanel);
	        this.layout = rootLayout;
	    }
	    /**
	     * Add a widget to the top content area.
	     */
	    ApplicationShell.prototype.addToTopArea = function (widget, options) {
	        if (options === void 0) { options = {}; }
	        if (!widget.id) {
	            console.error('widgets added to app shell must have unique id property');
	            return;
	        }
	        // Temporary: widgets are added to the panel in order of insertion.
	        this._topPanel.addChild(widget);
	    };
	    /**
	     * Add a widget to the left content area.
	     */
	    ApplicationShell.prototype.addToLeftArea = function (widget, options) {
	        if (options === void 0) { options = {}; }
	        if (!widget.id) {
	            console.error('widgets added to app shell must have unique id property');
	            return;
	        }
	        var rank = 'rank' in options ? options.rank : 100;
	        this._leftHandler.addWidget(widget, rank);
	    };
	    /**
	     * Add a widget to the right content area.
	     */
	    ApplicationShell.prototype.addToRightArea = function (widget, options) {
	        if (options === void 0) { options = {}; }
	        if (!widget.id) {
	            console.error('widgets added to app shell must have unique id property');
	            return;
	        }
	        var rank = 'rank' in options ? options.rank : 100;
	        this._rightHandler.addWidget(widget, rank);
	    };
	    /**
	     * Add a widget to the main content area.
	     */
	    ApplicationShell.prototype.addToMainArea = function (widget, options) {
	        if (options === void 0) { options = {}; }
	        // TODO
	        if (!widget.id) {
	            console.error('widgets added to app shell must have unique id property');
	            return;
	        }
	        this._dockPanel.insertTabAfter(widget);
	    };
	    /**
	     *
	     */
	    ApplicationShell.prototype.activateLeft = function (id) {
	        this._leftHandler.activate(id);
	    };
	    /**
	     *
	     */
	    ApplicationShell.prototype.activateRight = function (id) {
	        this._rightHandler.activate(id);
	    };
	    /**
	     *
	     */
	    ApplicationShell.prototype.activateMain = function (id) {
	        // TODO
	    };
	    /**
	     *
	     */
	    ApplicationShell.prototype.collapseLeft = function () {
	        this._leftHandler.collapse();
	    };
	    /**
	     *
	     */
	    ApplicationShell.prototype.collapseRight = function () {
	        this._rightHandler.collapse();
	    };
	    return ApplicationShell;
	}(phosphor_widget_1.Widget));
	exports.ApplicationShell = ApplicationShell;
	/**
	 * A class which manages a side bar and related stacked panel.
	 */
	var SideBarHandler = (function () {
	    /**
	     * Construct a new side bar handler.
	     */
	    function SideBarHandler(side) {
	        this._items = [];
	        this._side = side;
	        this._sideBar = new sidebar_1.SideBar();
	        this._stackedPanel = new phosphor_stackedpanel_1.StackedPanel();
	        this._sideBar.hide();
	        this._stackedPanel.hide();
	        this._sideBar.currentChanged.connect(this._onCurrentChanged, this);
	        this._stackedPanel.widgetRemoved.connect(this._onWidgetRemoved, this);
	    }
	    /**
	     * A less-than comparison function for side bar rank items.
	     */
	    SideBarHandler.itemCmp = function (first, second) {
	        return first.rank < second.rank;
	    };
	    Object.defineProperty(SideBarHandler.prototype, "sideBar", {
	        /**
	         * Get the side bar managed by the handler.
	         */
	        get: function () {
	            return this._sideBar;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SideBarHandler.prototype, "stackedPanel", {
	        /**
	         * Get the stacked panel managed by the handler
	         */
	        get: function () {
	            return this._stackedPanel;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Activate a widget residing in the side bar by ID.
	     *
	     * @param id - The widget's unique ID.
	     */
	    SideBarHandler.prototype.activate = function (id) {
	        var widget = this._findWidgetByID(id);
	        if (widget)
	            this._sideBar.currentTitle = widget.title;
	    };
	    /**
	     * Collapse the sidebar so no items are expanded.
	     */
	    SideBarHandler.prototype.collapse = function () {
	        this._sideBar.currentTitle = null;
	    };
	    /**
	     * Add a widget and its title to the stacked panel and side bar.
	     *
	     * If the widget is already added, it will be moved.
	     */
	    SideBarHandler.prototype.addWidget = function (widget, rank) {
	        widget.parent = null;
	        widget.hide();
	        var item = { widget: widget, rank: rank };
	        var index = this._findInsertIndex(item);
	        arrays.insert(this._items, index, item);
	        this._stackedPanel.insertChild(index, widget);
	        this._sideBar.insertTitle(index, widget.title);
	        this._refreshVisibility();
	    };
	    /**
	     * Find the insertion index for a rank item.
	     */
	    SideBarHandler.prototype._findInsertIndex = function (item) {
	        return arrays.upperBound(this._items, item, SideBarHandler.itemCmp);
	    };
	    /**
	     * Find the index of the item with the given widget, or `-1`.
	     */
	    SideBarHandler.prototype._findWidgetIndex = function (widget) {
	        return arrays.findIndex(this._items, function (item) { return item.widget === widget; });
	    };
	    /**
	     * Find the widget which owns the given title, or `null`.
	     */
	    SideBarHandler.prototype._findWidgetByTitle = function (title) {
	        var item = arrays.find(this._items, function (item) { return item.widget.title === title; });
	        return item ? item.widget : null;
	    };
	    /**
	     * Find the widget with the given id, or `null`.
	     */
	    SideBarHandler.prototype._findWidgetByID = function (id) {
	        var item = arrays.find(this._items, function (item) { return item.widget.id === id; });
	        return item ? item.widget : null;
	    };
	    /**
	     * Refresh the visibility of the side bar and stacked panel.
	     */
	    SideBarHandler.prototype._refreshVisibility = function () {
	        this._sideBar.setHidden(this._sideBar.titleCount() === 0);
	        this._stackedPanel.setHidden(this._sideBar.currentTitle === null);
	    };
	    /**
	     * Handle the `currentChanged` signal from the sidebar.
	     */
	    SideBarHandler.prototype._onCurrentChanged = function (sender, args) {
	        var oldWidget = this._findWidgetByTitle(args.oldValue);
	        var newWidget = this._findWidgetByTitle(args.newValue);
	        if (oldWidget)
	            oldWidget.hide();
	        if (newWidget)
	            newWidget.show();
	        if (newWidget) {
	            document.body.dataset[(this._side + "Area")] = newWidget.id;
	        }
	        else {
	            delete document.body.dataset[(this._side + "Area")];
	        }
	        this._refreshVisibility();
	    };
	    /*
	     * Handle the `widgetRemoved` signal from the stacked panel.
	     */
	    SideBarHandler.prototype._onWidgetRemoved = function (sender, widget) {
	        arrays.removeAt(this._items, this._findWidgetIndex(widget));
	        this._sideBar.removeTitle(widget.title);
	        this._refreshVisibility();
	    };
	    return SideBarHandler;
	}());


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	/**
	 * Execute a callback for each element in an array.
	 *
	 * @param array - The array of values to iterate.
	 *
	 * @param callback - The callback to invoke for the array elements.
	 *
	 * @param fromIndex - The starting index for iteration.
	 *
	 * @param wrap - Whether iteration wraps around at the end of the array.
	 *
	 * @returns The first value returned by `callback` which is not
	 *   equal to `undefined`, or `undefined` if the callback does
	 *   not return a value or if the start index is out of range.
	 *
	 * #### Notes
	 * It is not safe to modify the size of the array while iterating.
	 *
	 * #### Example
	 * ```typescript
	 * import * as arrays from 'phosphor-arrays';
	 *
	 * function logger(value: number): void {
	 *   console.log(value);
	 * }
	 *
	 * let data = [1, 2, 3, 4];
	 * arrays.forEach(data, logger);           // logs 1, 2, 3, 4
	 * arrays.forEach(data, logger, 2);        // logs 3, 4
	 * arrays.forEach(data, logger, 2, true);  // logs 3, 4, 1, 2
	 * arrays.forEach(data, (v, i) => {        // 2
	 *   if (v === 3) return i;
	 * });
	 * ```
	 *
	 * **See also** [[rforEach]]
	 */
	function forEach(array, callback, fromIndex, wrap) {
	    if (fromIndex === void 0) { fromIndex = 0; }
	    if (wrap === void 0) { wrap = false; }
	    var start = fromIndex | 0;
	    if (start < 0 || start >= array.length) {
	        return void 0;
	    }
	    if (wrap) {
	        for (var i = 0, n = array.length; i < n; ++i) {
	            var j = (start + i) % n;
	            var result = callback(array[j], j);
	            if (result !== void 0)
	                return result;
	        }
	    }
	    else {
	        for (var i = start, n = array.length; i < n; ++i) {
	            var result = callback(array[i], i);
	            if (result !== void 0)
	                return result;
	        }
	    }
	    return void 0;
	}
	exports.forEach = forEach;
	/**
	 * Execute a callback for each element in an array, in reverse.
	 *
	 * @param array - The array of values to iterate.
	 *
	 * @param callback - The callback to invoke for the array elements.
	 *
	 * @param fromIndex - The starting index for iteration.
	 *
	 * @param wrap - Whether iteration wraps around at the end of the array.
	 *
	 * @returns The first value returned by `callback` which is not
	 *   equal to `undefined`, or `undefined` if the callback does
	 *   not return a value or if the start index is out of range.
	 *
	 * #### Notes
	 * It is not safe to modify the size of the array while iterating.
	 *
	 * #### Example
	 * ```typescript
	 * import * as arrays from 'phosphor-arrays';
	 *
	 * function logger(value: number): void {
	 *   console.log(value);
	 * }
	 *
	 * let data = [1, 2, 3, 4];
	 * arrays.rforEach(data, logger);           // logs 4, 3, 2, 1
	 * arrays.rforEach(data, logger, 2);        // logs 3, 2, 1
	 * arrays.rforEach(data, logger, 2, true);  // logs 3, 2, 1, 4
	 * arrays.rforEach(data, (v, i) => {        // 2
	 *   if (v === 3) return i;
	 * });
	 * ```
	 * **See also** [[forEach]]
	 */
	function rforEach(array, callback, fromIndex, wrap) {
	    if (fromIndex === void 0) { fromIndex = array.length - 1; }
	    if (wrap === void 0) { wrap = false; }
	    var start = fromIndex | 0;
	    if (start < 0 || start >= array.length) {
	        return void 0;
	    }
	    if (wrap) {
	        for (var i = 0, n = array.length; i < n; ++i) {
	            var j = (start - i + n) % n;
	            var result = callback(array[j], j);
	            if (result !== void 0)
	                return result;
	        }
	    }
	    else {
	        for (var i = start; i >= 0; --i) {
	            var result = callback(array[i], i);
	            if (result !== void 0)
	                return result;
	        }
	    }
	    return void 0;
	}
	exports.rforEach = rforEach;
	/**
	 * Find the index of the first value which matches a predicate.
	 *
	 * @param array - The array of values to be searched.
	 *
	 * @param pred - The predicate function to apply to the values.
	 *
	 * @param fromIndex - The starting index of the search.
	 *
	 * @param wrap - Whether the search wraps around at the end of the array.
	 *
	 * @returns The index of the first matching value, or `-1` if no value
	 *   matches the predicate or if the start index is out of range.
	 *
	 * #### Notes
	 * It is not safe to modify the size of the array while iterating.
	 *
	 * #### Example
	 * ```typescript
	 * import * as arrays from 'phosphor-arrays';
	 *
	 * function isEven(value: number): boolean {
	 *   return value % 2 === 0;
	 * }
	 *
	 * let data = [1, 2, 3, 4, 3, 2, 1];
	 * arrays.findIndex(data, isEven);           // 1
	 * arrays.findIndex(data, isEven, 4);        // 5
	 * arrays.findIndex(data, isEven, 6);        // -1
	 * arrays.findIndex(data, isEven, 6, true);  // 1
	 * ```
	 *
	 * **See also** [[rfindIndex]].
	 */
	function findIndex(array, pred, fromIndex, wrap) {
	    if (fromIndex === void 0) { fromIndex = 0; }
	    if (wrap === void 0) { wrap = false; }
	    var start = fromIndex | 0;
	    if (start < 0 || start >= array.length) {
	        return -1;
	    }
	    if (wrap) {
	        for (var i = 0, n = array.length; i < n; ++i) {
	            var j = (start + i) % n;
	            if (pred(array[j], j))
	                return j;
	        }
	    }
	    else {
	        for (var i = start, n = array.length; i < n; ++i) {
	            if (pred(array[i], i))
	                return i;
	        }
	    }
	    return -1;
	}
	exports.findIndex = findIndex;
	/**
	 * Find the index of the last value which matches a predicate.
	 *
	 * @param array - The array of values to be searched.
	 *
	 * @param pred - The predicate function to apply to the values.
	 *
	 * @param fromIndex - The starting index of the search.
	 *
	 * @param wrap - Whether the search wraps around at the front of the array.
	 *
	 * @returns The index of the last matching value, or `-1` if no value
	 *   matches the predicate or if the start index is out of range.
	 *
	 * #### Notes
	 * It is not safe to modify the size of the array while iterating.
	 *
	 * #### Example
	 * ```typescript
	 * import * as arrays from 'phosphor-arrays';
	 *
	 * function isEven(value: number): boolean {
	 *   return value % 2 === 0;
	 * }
	 *
	 * let data = [1, 2, 3, 4, 3, 2, 1];
	 * arrays.rfindIndex(data, isEven);           // 5
	 * arrays.rfindIndex(data, isEven, 4);        // 3
	 * arrays.rfindIndex(data, isEven, 0);        // -1
	 * arrays.rfindIndex(data, isEven, 0, true);  // 5
	 * ```
	 *
	 * **See also** [[findIndex]].
	 */
	function rfindIndex(array, pred, fromIndex, wrap) {
	    if (fromIndex === void 0) { fromIndex = array.length - 1; }
	    if (wrap === void 0) { wrap = false; }
	    var start = fromIndex | 0;
	    if (start < 0 || start >= array.length) {
	        return -1;
	    }
	    if (wrap) {
	        for (var i = 0, n = array.length; i < n; ++i) {
	            var j = (start - i + n) % n;
	            if (pred(array[j], j))
	                return j;
	        }
	    }
	    else {
	        for (var i = start; i >= 0; --i) {
	            if (pred(array[i], i))
	                return i;
	        }
	    }
	    return -1;
	}
	exports.rfindIndex = rfindIndex;
	/**
	 * Find the first value which matches a predicate.
	 *
	 * @param array - The array of values to be searched.
	 *
	 * @param pred - The predicate function to apply to the values.
	 *
	 * @param fromIndex - The starting index of the search.
	 *
	 * @param wrap - Whether the search wraps around at the end of the array.
	 *
	 * @returns The first matching value, or `undefined` if no value matches
	 *   the predicate or if the start index is out of range.
	 *
	 * #### Notes
	 * It is not safe to modify the size of the array while iterating.
	 *
	 * #### Example
	 * ```typescript
	 * import * as arrays from 'phosphor-arrays';
	 *
	 * function isEven(value: number): boolean {
	 *   return value % 2 === 0;
	 * }
	 *
	 * let data = [1, 2, 3, 4, 3, 2, 1];
	 * arrays.find(data, isEven);           // 2
	 * arrays.find(data, isEven, 4);        // 2
	 * arrays.find(data, isEven, 6);        // undefined
	 * arrays.find(data, isEven, 6, true);  // 2
	 * ```
	 *
	 * **See also** [[rfind]].
	 */
	function find(array, pred, fromIndex, wrap) {
	    var i = findIndex(array, pred, fromIndex, wrap);
	    return i !== -1 ? array[i] : void 0;
	}
	exports.find = find;
	/**
	 * Find the last value which matches a predicate.
	 *
	 * @param array - The array of values to be searched.
	 *
	 * @param pred - The predicate function to apply to the values.
	 *
	 * @param fromIndex - The starting index of the search.
	 *
	 * @param wrap - Whether the search wraps around at the front of the array.
	 *
	 * @returns The last matching value, or `undefined` if no value matches
	 *   the predicate or if the start index is out of range.
	 *
	 * #### Notes
	 * The range of visited indices is set before the first invocation of
	 * `pred`. It is not safe for `pred` to change the length of `array`.
	 *
	 * #### Example
	 * ```typescript
	 * import * as arrays from 'phosphor-arrays';
	 *
	 * function isEven(value: number): boolean {
	 *   return value % 2 === 0;
	 * }
	 *
	 * let data = [1, 2, 3, 4, 3, 2, 1];
	 * arrays.rfind(data, isEven);           // 2
	 * arrays.rfind(data, isEven, 4);        // 4
	 * arrays.rfind(data, isEven, 0);        // undefined
	 * arrays.rfind(data, isEven, 0, true);  // 2
	 * ```
	 *
	 * **See also** [[find]].
	 */
	function rfind(array, pred, fromIndex, wrap) {
	    var i = rfindIndex(array, pred, fromIndex, wrap);
	    return i !== -1 ? array[i] : void 0;
	}
	exports.rfind = rfind;
	/**
	 * Insert an element into an array at a specified index.
	 *
	 * @param array - The array of values to modify.
	 *
	 * @param index - The index at which to insert the value. This value
	 *   is clamped to the bounds of the array.
	 *
	 * @param value - The value to insert into the array.
	 *
	 * @returns The index at which the value was inserted.
	 *
	 * #### Example
	 * ```typescript
	 * import * as arrays from 'phosphor-arrays';
	 *
	 * let data = [0, 1, 2, 3, 4];
	 * arrays.insert(data, 0, 12);  // 0
	 * arrays.insert(data, 3, 42);  // 3
	 * arrays.insert(data, -9, 9);  // 0
	 * arrays.insert(data, 12, 8);  // 8
	 * console.log(data);           // [9, 12, 0, 1, 42, 2, 3, 4, 8]
	 * ```
	 *
	 * **See also** [[removeAt]] and [[remove]]
	 */
	function insert(array, index, value) {
	    var j = Math.max(0, Math.min(index | 0, array.length));
	    for (var i = array.length; i > j; --i) {
	        array[i] = array[i - 1];
	    }
	    array[j] = value;
	    return j;
	}
	exports.insert = insert;
	/**
	 * Move an element in an array from one index to another.
	 *
	 * @param array - The array of values to modify.
	 *
	 * @param fromIndex - The index of the element to move.
	 *
	 * @param toIndex - The target index of the element.
	 *
	 * @returns `true` if the element was moved, or `false` if either
	 *   index is out of range.
	 *
	 * #### Example
	 * ```typescript
	 * import * as arrays from 'phosphor-arrays';
	 *
	 * let data = [0, 1, 2, 3, 4];
	 * arrays.move(data, 1, 2);   // true
	 * arrays.move(data, -1, 0);  // false
	 * arrays.move(data, 4, 2);   // true
	 * arrays.move(data, 10, 0);  // false
	 * console.log(data);         // [0, 2, 4, 1, 3]
	 * ```
	 */
	function move(array, fromIndex, toIndex) {
	    var j = fromIndex | 0;
	    if (j < 0 || j >= array.length) {
	        return false;
	    }
	    var k = toIndex | 0;
	    if (k < 0 || k >= array.length) {
	        return false;
	    }
	    var value = array[j];
	    if (j > k) {
	        for (var i = j; i > k; --i) {
	            array[i] = array[i - 1];
	        }
	    }
	    else if (j < k) {
	        for (var i = j; i < k; ++i) {
	            array[i] = array[i + 1];
	        }
	    }
	    array[k] = value;
	    return true;
	}
	exports.move = move;
	/**
	 * Remove an element from an array at a specified index.
	 *
	 * @param array - The array of values to modify.
	 *
	 * @param index - The index of the element to remove.
	 *
	 * @returns The removed value, or `undefined` if the index is out
	 *   of range.
	 *
	 * #### Example
	 * ```typescript
	 * import * as arrays from 'phosphor-arrays';
	 *
	 * let data = [0, 1, 2, 3, 4];
	 * arrays.removeAt(data, 1);   // 1
	 * arrays.removeAt(data, 3);   // 4
	 * arrays.removeAt(data, 10);  // undefined
	 * console.log(data);          // [0, 2, 3]
	 * ```
	 *
	 * **See also** [[remove]] and [[insert]]
	 */
	function removeAt(array, index) {
	    var j = index | 0;
	    if (j < 0 || j >= array.length) {
	        return void 0;
	    }
	    var value = array[j];
	    for (var i = j + 1, n = array.length; i < n; ++i) {
	        array[i - 1] = array[i];
	    }
	    array.length -= 1;
	    return value;
	}
	exports.removeAt = removeAt;
	/**
	 * Remove the first occurrence of a value from an array.
	 *
	 * @param array - The array of values to modify.
	 *
	 * @param value - The value to remove from the array.
	 *
	 * @returns The index where the value was located, or `-1` if the
	 *   value is not the array.
	 *
	 * #### Example
	 * ```typescript
	 * import * as arrays from 'phosphor-arrays';
	 *
	 * let data = [0, 1, 2, 3, 4];
	 * arrays.remove(data, 1);  // 1
	 * arrays.remove(data, 3);  // 2
	 * arrays.remove(data, 7);  // -1
	 * console.log(data);       // [0, 2, 4]
	 * ```
	 *
	 * **See also** [[removeAt]] and [[insert]]
	 */
	function remove(array, value) {
	    var j = -1;
	    for (var i = 0, n = array.length; i < n; ++i) {
	        if (array[i] === value) {
	            j = i;
	            break;
	        }
	    }
	    if (j === -1) {
	        return -1;
	    }
	    for (var i = j + 1, n = array.length; i < n; ++i) {
	        array[i - 1] = array[i];
	    }
	    array.length -= 1;
	    return j;
	}
	exports.remove = remove;
	/**
	 * Reverse an array in-place subject to an optional range.
	 *
	 * @param array - The array to reverse.
	 *
	 * @param fromIndex - The index of the first element of the range.
	 *   This value will be clamped to the array bounds.
	 *
	 * @param toIndex - The index of the last element of the range.
	 *   This value will be clamped to the array bounds.
	 *
	 * @returns A reference to the original array.
	 *
	 * #### Example
	 * ```typescript
	 * import * as arrays from 'phosphor-arrays';
	 *
	 * let data = [0, 1, 2, 3, 4];
	 * arrays.reverse(data, 1, 3);    // [0, 3, 2, 1, 4]
	 * arrays.reverse(data, 3);       // [0, 3, 2, 4, 1]
	 * arrays.reverse(data);          // [1, 4, 2, 3, 0]
	 * ```
	 *
	 * **See also** [[rotate]]
	 */
	function reverse(array, fromIndex, toIndex) {
	    if (fromIndex === void 0) { fromIndex = 0; }
	    if (toIndex === void 0) { toIndex = array.length; }
	    var i = Math.max(0, Math.min(fromIndex | 0, array.length - 1));
	    var j = Math.max(0, Math.min(toIndex | 0, array.length - 1));
	    if (j < i)
	        i = j + (j = i, 0);
	    while (i < j) {
	        var tmpval = array[i];
	        array[i++] = array[j];
	        array[j--] = tmpval;
	    }
	    return array;
	}
	exports.reverse = reverse;
	/**
	 * Rotate the elements of an array by a positive or negative delta.
	 *
	 * @param array - The array to rotate.
	 *
	 * @param delta - The amount of rotation to apply to the elements. A
	 *   positive delta will shift the elements to the left. A negative
	 *   delta will shift the elements to the right.
	 *
	 * @returns A reference to the original array.
	 *
	 * #### Notes
	 * This executes in `O(n)` time and `O(1)` space.
	 *
	 * #### Example
	 * ```typescript
	 * import * as arrays from 'phosphor-arrays';
	 *
	 * let data = [0, 1, 2, 3, 4];
	 * arrays.rotate(data, 2);    // [2, 3, 4, 0, 1]
	 * arrays.rotate(data, -2);   // [0, 1, 2, 3, 4]
	 * arrays.rotate(data, 10);   // [0, 1, 2, 3, 4]
	 * arrays.rotate(data, 9);    // [4, 0, 1, 2, 3]
	 * ```
	 *
	 * **See also** [[reverse]]
	 */
	function rotate(array, delta) {
	    var n = array.length;
	    if (n <= 1) {
	        return array;
	    }
	    var d = delta | 0;
	    if (d > 0) {
	        d = d % n;
	    }
	    else if (d < 0) {
	        d = ((d % n) + n) % n;
	    }
	    if (d === 0) {
	        return array;
	    }
	    reverse(array, 0, d - 1);
	    reverse(array, d, n - 1);
	    reverse(array, 0, n - 1);
	    return array;
	}
	exports.rotate = rotate;
	/**
	 * Using a binary search, find the index of the first element in an
	 * array which compares `>=` to a value.
	 *
	 * @param array - The array of values to be searched. It must be sorted
	 *   in ascending order.
	 *
	 * @param value - The value to locate in the array.
	 *
	 * @param cmp - The comparison function which returns `true` if an
	 *   array element is less than the given value.
	 *
	 * @returns The index of the first element in `array` which compares
	 *   `>=` to `value`, or `array.length` if there is no such element.
	 *
	 * #### Notes
	 * It is not safe for the comparison function to modify the array.
	 *
	 * #### Example
	 * ```typescript
	 * import * as arrays from 'phosphor-arrays';
	 *
	 * function numberCmp(a: number, b: number): boolean {
	 *   return a < b;
	 * }
	 *
	 * let data = [0, 3, 4, 7, 7, 9];
	 * arrays.lowerBound(data, 0, numberCmp);   // 0
	 * arrays.lowerBound(data, 6, numberCmp);   // 3
	 * arrays.lowerBound(data, 7, numberCmp);   // 3
	 * arrays.lowerBound(data, -1, numberCmp);  // 0
	 * arrays.lowerBound(data, 10, numberCmp);  // 6
	 * ```
	 *
	 * **See also** [[upperBound]]
	 */
	function lowerBound(array, value, cmp) {
	    var begin = 0;
	    var half;
	    var middle;
	    var n = array.length;
	    while (n > 0) {
	        half = n >> 1;
	        middle = begin + half;
	        if (cmp(array[middle], value)) {
	            begin = middle + 1;
	            n -= half + 1;
	        }
	        else {
	            n = half;
	        }
	    }
	    return begin;
	}
	exports.lowerBound = lowerBound;
	/**
	 * Using a binary search, find the index of the first element in an
	 * array which compares `>` than a value.
	 *
	 * @param array - The array of values to be searched. It must be sorted
	 *   in ascending order.
	 *
	 * @param value - The value to locate in the array.
	 *
	 * @param cmp - The comparison function which returns `true` if the
	 *   the given value is less than an array element.
	 *
	 * @returns The index of the first element in `array` which compares
	 *   `>` than `value`, or `array.length` if there is no such element.
	 *
	 * #### Notes
	 * It is not safe for the comparison function to modify the array.
	 *
	 * #### Example
	 * ```typescript
	 * import * as arrays from 'phosphor-arrays';
	 *
	 * function numberCmp(a: number, b: number): number {
	 *   return a < b;
	 * }
	 *
	 * let data = [0, 3, 4, 7, 7, 9];
	 * arrays.upperBound(data, 0, numberCmp);   // 1
	 * arrays.upperBound(data, 6, numberCmp);   // 3
	 * arrays.upperBound(data, 7, numberCmp);   // 5
	 * arrays.upperBound(data, -1, numberCmp);  // 0
	 * arrays.upperBound(data, 10, numberCmp);  // 6
	 * ```
	 *
	 * **See also** [[lowerBound]]
	 */
	function upperBound(array, value, cmp) {
	    var begin = 0;
	    var half;
	    var middle;
	    var n = array.length;
	    while (n > 0) {
	        half = n >> 1;
	        middle = begin + half;
	        if (cmp(value, array[middle])) {
	            n = half;
	        }
	        else {
	            begin = middle + 1;
	            n -= half + 1;
	        }
	    }
	    return begin;
	}
	exports.upperBound = upperBound;
	//# sourceMappingURL=index.js.map

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(5));
	__export(__webpack_require__(29));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var arrays = __webpack_require__(3);
	var phosphor_boxengine_1 = __webpack_require__(6);
	var phosphor_domutil_1 = __webpack_require__(7);
	var phosphor_messaging_1 = __webpack_require__(13);
	var phosphor_properties_1 = __webpack_require__(17);
	var phosphor_panel_1 = __webpack_require__(18);
	var phosphor_widget_1 = __webpack_require__(20);
	/**
	 * The class name added to left-to-right box layout parents.
	 */
	var LEFT_TO_RIGHT_CLASS = 'p-mod-left-to-right';
	/**
	 * The class name added to right-to-left box layout parents.
	 */
	var RIGHT_TO_LEFT_CLASS = 'p-mod-right-to-left';
	/**
	 * The class name added to top-to-bottom box layout parents.
	 */
	var TOP_TO_BOTTOM_CLASS = 'p-mod-top-to-bottom';
	/**
	 * The class name added to bottom-to-top box layout parents.
	 */
	var BOTTOM_TO_TOP_CLASS = 'p-mod-bottom-to-top';
	/**
	 * The layout direction of a box layout.
	 */
	(function (Direction) {
	    /**
	     * Left to right direction.
	     */
	    Direction[Direction["LeftToRight"] = 0] = "LeftToRight";
	    /**
	     * Right to left direction.
	     */
	    Direction[Direction["RightToLeft"] = 1] = "RightToLeft";
	    /**
	     * Top to bottom direction.
	     */
	    Direction[Direction["TopToBottom"] = 2] = "TopToBottom";
	    /**
	     * Bottom to top direction.
	     */
	    Direction[Direction["BottomToTop"] = 3] = "BottomToTop";
	})(exports.Direction || (exports.Direction = {}));
	var Direction = exports.Direction;
	/**
	 * A layout which arranges its children in a single row or column.
	 */
	var BoxLayout = (function (_super) {
	    __extends(BoxLayout, _super);
	    function BoxLayout() {
	        _super.apply(this, arguments);
	        this._fixed = 0;
	        this._spacing = 8;
	        this._box = null;
	        this._sizers = [];
	        this._direction = Direction.TopToBottom;
	    }
	    Object.defineProperty(BoxLayout.prototype, "direction", {
	        /**
	         * Get the layout direction for the box layout.
	         */
	        get: function () {
	            return this._direction;
	        },
	        /**
	         * Set the layout direction for the box layout.
	         */
	        set: function (value) {
	            if (this._direction === value) {
	                return;
	            }
	            this._direction = value;
	            if (!this.parent) {
	                return;
	            }
	            BoxLayoutPrivate.toggleDirection(this.parent, value);
	            this.parent.fit();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BoxLayout.prototype, "spacing", {
	        /**
	         * Get the inter-element spacing for the box layout.
	         */
	        get: function () {
	            return this._spacing;
	        },
	        /**
	         * Set the inter-element spacing for the box layout.
	         */
	        set: function (value) {
	            value = Math.max(0, value | 0);
	            if (this._spacing === value) {
	                return;
	            }
	            this._spacing = value;
	            if (!this.parent) {
	                return;
	            }
	            this.parent.fit();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Initialize the children of the layout.
	     *
	     * #### Notes
	     * This method is called automatically when the layout is installed
	     * on its parent widget.
	     */
	    BoxLayout.prototype.initialize = function () {
	        BoxLayoutPrivate.toggleDirection(this.parent, this.direction);
	        _super.prototype.initialize.call(this);
	    };
	    /**
	     * Attach a child widget to the parent's DOM node.
	     *
	     * @param index - The current index of the child in the layout.
	     *
	     * @param child - The child widget to attach to the parent.
	     *
	     * #### Notes
	     * This is a reimplementation of the superclass method.
	     */
	    BoxLayout.prototype.attachChild = function (index, child) {
	        arrays.insert(this._sizers, index, new phosphor_boxengine_1.BoxSizer());
	        BoxLayoutPrivate.prepareGeometry(child);
	        this.parent.node.appendChild(child.node);
	        if (this.parent.isAttached)
	            phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgAfterAttach);
	        this.parent.fit();
	    };
	    /**
	     * Move a child widget in the parent's DOM node.
	     *
	     * @param fromIndex - The previous index of the child in the layout.
	     *
	     * @param toIndex - The current index of the child in the layout.
	     *
	     * @param child - The child widget to move in the parent.
	     *
	     * #### Notes
	     * This is a reimplementation of the superclass method.
	     */
	    BoxLayout.prototype.moveChild = function (fromIndex, toIndex, child) {
	        arrays.move(this._sizers, fromIndex, toIndex);
	        this.parent.update();
	    };
	    /**
	     * Detach a child widget from the parent's DOM node.
	     *
	     * @param index - The previous index of the child in the layout.
	     *
	     * @param child - The child widget to detach from the parent.
	     *
	     * #### Notes
	     * This is a reimplementation of the superclass method.
	     */
	    BoxLayout.prototype.detachChild = function (index, child) {
	        arrays.removeAt(this._sizers, index);
	        if (this.parent.isAttached)
	            phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgBeforeDetach);
	        this.parent.node.removeChild(child.node);
	        BoxLayoutPrivate.resetGeometry(child);
	        this.parent.fit();
	    };
	    /**
	     * A message handler invoked on an `'after-show'` message.
	     */
	    BoxLayout.prototype.onAfterShow = function (msg) {
	        _super.prototype.onAfterShow.call(this, msg);
	        this.parent.update();
	    };
	    /**
	     * A message handler invoked on an `'after-attach'` message.
	     */
	    BoxLayout.prototype.onAfterAttach = function (msg) {
	        _super.prototype.onAfterAttach.call(this, msg);
	        this.parent.fit();
	    };
	    /**
	     * A message handler invoked on a `'child-shown'` message.
	     */
	    BoxLayout.prototype.onChildShown = function (msg) {
	        if (BoxLayoutPrivate.IsIE) {
	            phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgFitRequest);
	        }
	        else {
	            this.parent.fit();
	        }
	    };
	    /**
	     * A message handler invoked on a `'child-hidden'` message.
	     */
	    BoxLayout.prototype.onChildHidden = function (msg) {
	        if (BoxLayoutPrivate.IsIE) {
	            phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgFitRequest);
	        }
	        else {
	            this.parent.fit();
	        }
	    };
	    /**
	     * A message handler invoked on a `'resize'` message.
	     */
	    BoxLayout.prototype.onResize = function (msg) {
	        if (this.parent.isVisible) {
	            this._update(msg.width, msg.height);
	        }
	    };
	    /**
	     * A message handler invoked on an `'update-request'` message.
	     */
	    BoxLayout.prototype.onUpdateRequest = function (msg) {
	        if (this.parent.isVisible) {
	            this._update(-1, -1);
	        }
	    };
	    /**
	     * A message handler invoked on a `'fit-request'` message.
	     */
	    BoxLayout.prototype.onFitRequest = function (msg) {
	        if (this.parent.isAttached) {
	            this._fit();
	        }
	    };
	    /**
	     * Fit the layout to the total size required by the child widgets.
	     */
	    BoxLayout.prototype._fit = function () {
	        // Compute the visible item count.
	        var nVisible = 0;
	        for (var i = 0, n = this.childCount(); i < n; ++i) {
	            if (!this.childAt(i).isHidden)
	                nVisible++;
	        }
	        // Update the fixed space for the visible items.
	        this._fixed = this._spacing * Math.max(0, nVisible - 1);
	        // Setup the initial size limits.
	        var minW = 0;
	        var minH = 0;
	        var maxW = Infinity;
	        var maxH = Infinity;
	        var horz = BoxLayoutPrivate.isHorizontal(this._direction);
	        if (horz) {
	            minW = this._fixed;
	            maxW = nVisible > 0 ? minW : maxW;
	        }
	        else {
	            minH = this._fixed;
	            maxH = nVisible > 0 ? minH : maxH;
	        }
	        // Update the sizers and computed size limits.
	        for (var i = 0, n = this.childCount(); i < n; ++i) {
	            var child = this.childAt(i);
	            var sizer = this._sizers[i];
	            if (child.isHidden) {
	                sizer.minSize = 0;
	                sizer.maxSize = 0;
	                continue;
	            }
	            var limits = phosphor_domutil_1.sizeLimits(child.node);
	            sizer.sizeHint = BoxLayout.getSizeBasis(child);
	            sizer.stretch = BoxLayout.getStretch(child);
	            if (horz) {
	                sizer.minSize = limits.minWidth;
	                sizer.maxSize = limits.maxWidth;
	                minW += limits.minWidth;
	                maxW += limits.maxWidth;
	                minH = Math.max(minH, limits.minHeight);
	                maxH = Math.min(maxH, limits.maxHeight);
	            }
	            else {
	                sizer.minSize = limits.minHeight;
	                sizer.maxSize = limits.maxHeight;
	                minH += limits.minHeight;
	                maxH += limits.maxHeight;
	                minW = Math.max(minW, limits.minWidth);
	                maxW = Math.min(maxW, limits.maxWidth);
	            }
	        }
	        // Update the box sizing and add it to the size constraints.
	        var box = this._box = phosphor_domutil_1.boxSizing(this.parent.node);
	        minW += box.horizontalSum;
	        minH += box.verticalSum;
	        maxW += box.horizontalSum;
	        maxH += box.verticalSum;
	        // Update the parent's size constraints.
	        var style = this.parent.node.style;
	        style.minWidth = minW + "px";
	        style.minHeight = minH + "px";
	        style.maxWidth = maxW === Infinity ? 'none' : maxW + "px";
	        style.maxHeight = maxH === Infinity ? 'none' : maxH + "px";
	        // Notify the ancestor that it should fit immediately.
	        var ancestor = this.parent.parent;
	        if (ancestor)
	            phosphor_messaging_1.sendMessage(ancestor, phosphor_widget_1.Widget.MsgFitRequest);
	        // Notify the parent that it should update immediately.
	        phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgUpdateRequest);
	    };
	    /**
	     * Update the layout position and size of the child widgets.
	     *
	     * The parent offset dimensions should be `-1` if unknown.
	     */
	    BoxLayout.prototype._update = function (offsetWidth, offsetHeight) {
	        // Bail early if there are no children to layout.
	        if (this.childCount() === 0) {
	            return;
	        }
	        // Measure the parent if the offset dimensions are unknown.
	        if (offsetWidth < 0) {
	            offsetWidth = this.parent.node.offsetWidth;
	        }
	        if (offsetHeight < 0) {
	            offsetHeight = this.parent.node.offsetHeight;
	        }
	        // Ensure the parent box sizing data is computed.
	        var box = this._box || (this._box = phosphor_domutil_1.boxSizing(this.parent.node));
	        // Compute the layout area adjusted for border and padding.
	        var top = box.paddingTop;
	        var left = box.paddingLeft;
	        var width = offsetWidth - box.horizontalSum;
	        var height = offsetHeight - box.verticalSum;
	        // Distribute the layout space and adjust the start position.
	        switch (this._direction) {
	            case Direction.LeftToRight:
	                phosphor_boxengine_1.boxCalc(this._sizers, Math.max(0, width - this._fixed));
	                break;
	            case Direction.TopToBottom:
	                phosphor_boxengine_1.boxCalc(this._sizers, Math.max(0, height - this._fixed));
	                break;
	            case Direction.RightToLeft:
	                phosphor_boxengine_1.boxCalc(this._sizers, Math.max(0, width - this._fixed));
	                left += width;
	                break;
	            case Direction.BottomToTop:
	                phosphor_boxengine_1.boxCalc(this._sizers, Math.max(0, height - this._fixed));
	                top += height;
	                break;
	        }
	        // Layout the children using the computed box sizes.
	        for (var i = 0, n = this.childCount(); i < n; ++i) {
	            var child = this.childAt(i);
	            if (child.isHidden) {
	                continue;
	            }
	            var size = this._sizers[i].size;
	            switch (this._direction) {
	                case Direction.LeftToRight:
	                    BoxLayoutPrivate.setGeometry(child, left, top, size, height);
	                    left += size + this._spacing;
	                    break;
	                case Direction.TopToBottom:
	                    BoxLayoutPrivate.setGeometry(child, left, top, width, size);
	                    top += size + this._spacing;
	                    break;
	                case Direction.RightToLeft:
	                    BoxLayoutPrivate.setGeometry(child, left - size, top, size, height);
	                    left -= size + this._spacing;
	                    break;
	                case Direction.BottomToTop:
	                    BoxLayoutPrivate.setGeometry(child, left, top - size, width, size);
	                    top -= size + this._spacing;
	                    break;
	            }
	        }
	    };
	    return BoxLayout;
	})(phosphor_panel_1.PanelLayout);
	exports.BoxLayout = BoxLayout;
	/**
	 * The namespace for the `BoxLayout` class statics.
	 */
	var BoxLayout;
	(function (BoxLayout) {
	    /**
	     * A convenience alias of the `LeftToRight` [[Direction]].
	     */
	    BoxLayout.LeftToRight = Direction.LeftToRight;
	    /**
	     * A convenience alias of the `RightToLeft` [[Direction]].
	     */
	    BoxLayout.RightToLeft = Direction.RightToLeft;
	    /**
	     * A convenience alias of the `TopToBottom` [[Direction]].
	     */
	    BoxLayout.TopToBottom = Direction.TopToBottom;
	    /**
	     * A convenience alias of the `BottomToTop` [[Direction]].
	     */
	    BoxLayout.BottomToTop = Direction.BottomToTop;
	    /**
	     * Get the box layout stretch factor for the given widget.
	     *
	     * @param widget - The widget of interest.
	     *
	     * @returns The box layout stretch factor for the widget.
	     */
	    function getStretch(widget) {
	        return BoxLayoutPrivate.stretchProperty.get(widget);
	    }
	    BoxLayout.getStretch = getStretch;
	    /**
	     * Set the box layout stretch factor for the given widget.
	     *
	     * @param widget - The widget of interest.
	     *
	     * @param value - The value for the stretch factor.
	     */
	    function setStretch(widget, value) {
	        BoxLayoutPrivate.stretchProperty.set(widget, value);
	    }
	    BoxLayout.setStretch = setStretch;
	    /**
	     * Get the box layout size basis for the given widget.
	     *
	     * @param widget - The widget of interest.
	     *
	     * @returns The box layout size basis for the widget.
	     */
	    function getSizeBasis(widget) {
	        return BoxLayoutPrivate.sizeBasisProperty.get(widget);
	    }
	    BoxLayout.getSizeBasis = getSizeBasis;
	    /**
	     * Set the box layout size basis for the given widget.
	     *
	     * @param widget - The widget of interest.
	     *
	     * @param value - The value for the size basis.
	     */
	    function setSizeBasis(widget, value) {
	        BoxLayoutPrivate.sizeBasisProperty.set(widget, value);
	    }
	    BoxLayout.setSizeBasis = setSizeBasis;
	})(BoxLayout = exports.BoxLayout || (exports.BoxLayout = {}));
	/**
	 * The namespace for the `BoxLayout` class private data.
	 */
	var BoxLayoutPrivate;
	(function (BoxLayoutPrivate) {
	    /**
	     * A flag indicating whether the browser is IE.
	     */
	    BoxLayoutPrivate.IsIE = /Trident/.test(navigator.userAgent);
	    /**
	     * The property descriptor for a widget stretch factor.
	     */
	    BoxLayoutPrivate.stretchProperty = new phosphor_properties_1.Property({
	        name: 'stretch',
	        value: 0,
	        coerce: function (owner, value) { return Math.max(0, value | 0); },
	        changed: onChildPropertyChanged,
	    });
	    /**
	     * The property descriptor for a widget size basis.
	     */
	    BoxLayoutPrivate.sizeBasisProperty = new phosphor_properties_1.Property({
	        name: 'sizeBasis',
	        value: 0,
	        coerce: function (owner, value) { return Math.max(0, value | 0); },
	        changed: onChildPropertyChanged,
	    });
	    /**
	     * Test whether a direction has horizontal orientation.
	     */
	    function isHorizontal(dir) {
	        return dir === Direction.LeftToRight || dir === Direction.RightToLeft;
	    }
	    BoxLayoutPrivate.isHorizontal = isHorizontal;
	    /**
	     * Toggle the CSS direction class for the given widget.
	     */
	    function toggleDirection(widget, dir) {
	        widget.toggleClass(LEFT_TO_RIGHT_CLASS, dir === Direction.LeftToRight);
	        widget.toggleClass(RIGHT_TO_LEFT_CLASS, dir === Direction.RightToLeft);
	        widget.toggleClass(TOP_TO_BOTTOM_CLASS, dir === Direction.TopToBottom);
	        widget.toggleClass(BOTTOM_TO_TOP_CLASS, dir === Direction.BottomToTop);
	    }
	    BoxLayoutPrivate.toggleDirection = toggleDirection;
	    /**
	     * Prepare a child widget for absolute layout geometry.
	     */
	    function prepareGeometry(widget) {
	        widget.node.style.position = 'absolute';
	    }
	    BoxLayoutPrivate.prepareGeometry = prepareGeometry;
	    /**
	     * Reset the layout geometry of a child widget.
	     */
	    function resetGeometry(widget) {
	        var rect = rectProperty.get(widget);
	        var style = widget.node.style;
	        rect.top = NaN;
	        rect.left = NaN;
	        rect.width = NaN;
	        rect.height = NaN;
	        style.position = '';
	        style.top = '';
	        style.left = '';
	        style.width = '';
	        style.height = '';
	    }
	    BoxLayoutPrivate.resetGeometry = resetGeometry;
	    /**
	     * Set the layout geometry of a child widget.
	     */
	    function setGeometry(widget, left, top, width, height) {
	        var resized = false;
	        var style = widget.node.style;
	        var rect = rectProperty.get(widget);
	        if (rect.top !== top) {
	            rect.top = top;
	            style.top = top + "px";
	        }
	        if (rect.left !== left) {
	            rect.left = left;
	            style.left = left + "px";
	        }
	        if (rect.width !== width) {
	            resized = true;
	            rect.width = width;
	            style.width = width + "px";
	        }
	        if (rect.height !== height) {
	            resized = true;
	            rect.height = height;
	            style.height = height + "px";
	        }
	        if (resized) {
	            phosphor_messaging_1.sendMessage(widget, new phosphor_widget_1.ResizeMessage(width, height));
	        }
	    }
	    BoxLayoutPrivate.setGeometry = setGeometry;
	    /**
	     * A property descriptor for a widget offset rect.
	     */
	    var rectProperty = new phosphor_properties_1.Property({
	        name: 'rect',
	        create: function () { return ({ top: NaN, left: NaN, width: NaN, height: NaN }); },
	    });
	    /**
	     * The change handler for the attached child properties.
	     */
	    function onChildPropertyChanged(child) {
	        var parent = child.parent;
	        var layout = parent && parent.layout;
	        if (layout instanceof BoxLayout)
	            parent.fit();
	    }
	})(BoxLayoutPrivate || (BoxLayoutPrivate = {}));


/***/ },
/* 6 */
/***/ function(module, exports) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	/**
	 * The sizer object for the [[boxCalc]] function.
	 *
	 * A box sizer holds the geometry information for an object along the
	 * layout orientation. An array of box sizers representing a line of
	 * objects is passed to [[boxCalc]] along with the amount of space
	 * available for layout. The algorithm will update the [[size]] of
	 * each box sizer with its computed size.
	 *
	 * #### Notes
	 * For best performance, this class should be treated as a raw data
	 * struct. It should not typically be subclassed.
	 */
	var BoxSizer = (function () {
	    function BoxSizer() {
	        /**
	         * The preferred size for the sizer.
	         *
	         * The sizer will be given this initial size subject to its size
	         * bounds. The sizer will not deviate from this size unless such
	         * deviation is required to fit into the available layout space.
	         *
	         * #### Notes
	         * There is no limit to this value, but it will be clamped to the
	         * bounds defined by [[minSize]] and [[maxSize]].
	         *
	         * The default value is `0`.
	         */
	        this.sizeHint = 0;
	        /**
	         * The minimum size of the sizer.
	         *
	         * The sizer will never be sized less than this value, even if
	         * it means the sizer will overflow the available layout space.
	         *
	         * #### Notes
	         * It is assumed that this value lies in the range `[0, Infinity)`
	         * and that it is `<=` to [[maxSize]]. Failure to adhere to this
	         * constraint will yield undefined results.
	         *
	         * The default value is `0`.
	         */
	        this.minSize = 0;
	        /**
	         * The maximum size of the sizer.
	         *
	         * The sizer will never be sized greater than this value, even if
	         * it means the sizer will underflow the available layout space.
	         *
	         * #### Notes
	         * It is assumed that this value lies in the range `[0, Infinity]`
	         * and that it is `>=` to [[minSize]]. Failure to adhere to this
	         * constraint will yield undefined results.
	         *
	         * The default value is `Infinity`.
	         */
	        this.maxSize = Infinity;
	        /**
	         * The stretch factor for the sizer.
	         *
	         * This controls how much the sizer stretches relative to its sibling
	         * sizers when layout space is distributed. A stretch factor of zero
	         * is special and will cause the sizer to only be resized after all
	         * other sizers with a stretch factor greater than zero have been
	         * resized to their limits.
	         *
	         * #### Notes
	         * It is assumed that this value is an integer that lies in the range
	         * `[0, Infinity)`. Failure to adhere to this constraint will yield
	         * undefined results.
	         *
	         * The default value is `1`.
	         */
	        this.stretch = 1;
	        /**
	         * The computed size of the sizer.
	         *
	         * This value is the output of a call to [[boxCalc]]. It represents
	         * the computed size for the object along the layout orientation,
	         * and will always lie in the range `[minSize, maxSize]`.
	         *
	         * #### Notes
	         * This value is output only. Changing the value will have no effect.
	         */
	        this.size = 0;
	        /**
	         * An internal storage property for the layout algorithm.
	         *
	         * #### Notes
	         * This value is used as temporary storage by the layout algorithm.
	         * Changing the value will have no effect.
	         */
	        this.done = false;
	    }
	    return BoxSizer;
	})();
	exports.BoxSizer = BoxSizer;
	/**
	 * Compute the optimal layout sizes for an array of box sizers.
	 *
	 * This distributes the available layout space among the box sizers
	 * according to the following algorithm:
	 *
	 * 1. Initialize the sizers's size to its size hint and compute the
	 *    sums for each of size hint, min size, and max size.
	 *
	 * 2. If the total size hint equals the available space, return.
	 *
	 * 3. If the available space is less than the total min size, set all
	 *    sizers to their min size and return.
	 *
	 * 4. If the available space is greater than the total max size, set
	 *    all sizers to their max size and return.
	 *
	 * 5. If the layout space is less than the total size hint, distribute
	 *    the negative delta as follows:
	 *
	 *    a. Shrink each sizer with a stretch factor greater than zero by
	 *       an amount proportional to the negative space and the sum of
	 *       stretch factors. If the sizer reaches its min size, remove
	 *       it and its stretch factor from the computation.
	 *
	 *    b. If after adjusting all stretch sizers there remains negative
	 *       space, distribute the space equally among the sizers with a
	 *       stretch factor of zero. If a sizer reaches its min size,
	 *       remove it from the computation.
	 *
	 * 6. If the layout space is greater than the total size hint,
	 *    distribute the positive delta as follows:
	 *
	 *    a. Expand each sizer with a stretch factor greater than zero by
	 *       an amount proportional to the postive space and the sum of
	 *       stretch factors. If the sizer reaches its max size, remove
	 *       it and its stretch factor from the computation.
	 *
	 *    b. If after adjusting all stretch sizers there remains positive
	 *       space, distribute the space equally among the sizers with a
	 *       stretch factor of zero. If a sizer reaches its max size,
	 *       remove it from the computation.
	 *
	 * 7. return
	 *
	 * @param sizers - The sizers for a particular layout line.
	 *
	 * @param space - The available layout space for the sizers.
	 *
	 * #### Notes
	 * This function can be called at any time to recompute the layout
	 * sizing for an existing array of sizers. The previously computed
	 * results will have no effect on the new output. It is therefore
	 * not necessary to create new sizers on each resize event.
	 */
	function boxCalc(sizers, space) {
	    // Bail early if there is nothing to do.
	    var count = sizers.length;
	    if (count === 0) {
	        return;
	    }
	    // Setup the size and stretch counters.
	    var totalMin = 0;
	    var totalMax = 0;
	    var totalSize = 0;
	    var totalStretch = 0;
	    var stretchCount = 0;
	    // Setup the sizers and compute the totals.
	    for (var i = 0; i < count; ++i) {
	        var sizer = sizers[i];
	        initSizer(sizer);
	        totalSize += sizer.size;
	        totalMin += sizer.minSize;
	        totalMax += sizer.maxSize;
	        if (sizer.stretch > 0) {
	            totalStretch += sizer.stretch;
	            stretchCount++;
	        }
	    }
	    // If the space is equal to the total size, return.
	    if (space === totalSize) {
	        return;
	    }
	    // If the space is less than the total min, minimize each sizer.
	    if (space <= totalMin) {
	        for (var i = 0; i < count; ++i) {
	            var sizer = sizers[i];
	            sizer.size = sizer.minSize;
	        }
	        return;
	    }
	    // If the space is greater than the total max, maximize each sizer.
	    if (space >= totalMax) {
	        for (var i = 0; i < count; ++i) {
	            var sizer = sizers[i];
	            sizer.size = sizer.maxSize;
	        }
	        return;
	    }
	    // The loops below perform sub-pixel precision sizing. A near zero
	    // value is used for compares instead of zero to ensure that the
	    // loop terminates when the subdivided space is reasonably small.
	    var nearZero = 0.01;
	    // A counter which is decremented each time a sizer is resized to
	    // its limit. This ensures the loops terminate even if there is
	    // space remaining to distribute.
	    var notDoneCount = count;
	    // Distribute negative delta space.
	    if (space < totalSize) {
	        // Shrink each stretchable sizer by an amount proportional to its
	        // stretch factor. If a sizer reaches its min size it's marked as
	        // done. The loop progresses in phases where each sizer is given
	        // a chance to consume its fair share for the pass, regardless of
	        // whether a sizer before it reached its limit. This continues
	        // until the stretchable sizers or the free space is exhausted.
	        var freeSpace = totalSize - space;
	        while (stretchCount > 0 && freeSpace > nearZero) {
	            var distSpace = freeSpace;
	            var distStretch = totalStretch;
	            for (var i = 0; i < count; ++i) {
	                var sizer = sizers[i];
	                if (sizer.done || sizer.stretch === 0) {
	                    continue;
	                }
	                var amt = sizer.stretch * distSpace / distStretch;
	                if (sizer.size - amt <= sizer.minSize) {
	                    freeSpace -= sizer.size - sizer.minSize;
	                    totalStretch -= sizer.stretch;
	                    sizer.size = sizer.minSize;
	                    sizer.done = true;
	                    notDoneCount--;
	                    stretchCount--;
	                }
	                else {
	                    freeSpace -= amt;
	                    sizer.size -= amt;
	                }
	            }
	        }
	        // Distribute any remaining space evenly among the non-stretchable
	        // sizers. This progresses in phases in the same manner as above.
	        while (notDoneCount > 0 && freeSpace > nearZero) {
	            var amt = freeSpace / notDoneCount;
	            for (var i = 0; i < count; ++i) {
	                var sizer = sizers[i];
	                if (sizer.done) {
	                    continue;
	                }
	                if (sizer.size - amt <= sizer.minSize) {
	                    freeSpace -= sizer.size - sizer.minSize;
	                    sizer.size = sizer.minSize;
	                    sizer.done = true;
	                    notDoneCount--;
	                }
	                else {
	                    freeSpace -= amt;
	                    sizer.size -= amt;
	                }
	            }
	        }
	    }
	    else {
	        // Expand each stretchable sizer by an amount proportional to its
	        // stretch factor. If a sizer reaches its max size it's marked as
	        // done. The loop progresses in phases where each sizer is given
	        // a chance to consume its fair share for the pass, regardless of
	        // whether a sizer before it reached its limit. This continues
	        // until the stretchable sizers or the free space is exhausted.
	        var freeSpace = space - totalSize;
	        while (stretchCount > 0 && freeSpace > nearZero) {
	            var distSpace = freeSpace;
	            var distStretch = totalStretch;
	            for (var i = 0; i < count; ++i) {
	                var sizer = sizers[i];
	                if (sizer.done || sizer.stretch === 0) {
	                    continue;
	                }
	                var amt = sizer.stretch * distSpace / distStretch;
	                if (sizer.size + amt >= sizer.maxSize) {
	                    freeSpace -= sizer.maxSize - sizer.size;
	                    totalStretch -= sizer.stretch;
	                    sizer.size = sizer.maxSize;
	                    sizer.done = true;
	                    notDoneCount--;
	                    stretchCount--;
	                }
	                else {
	                    freeSpace -= amt;
	                    sizer.size += amt;
	                }
	            }
	        }
	        // Distribute any remaining space evenly among the non-stretchable
	        // sizers. This progresses in phases in the same manner as above.
	        while (notDoneCount > 0 && freeSpace > nearZero) {
	            var amt = freeSpace / notDoneCount;
	            for (var i = 0; i < count; ++i) {
	                var sizer = sizers[i];
	                if (sizer.done) {
	                    continue;
	                }
	                if (sizer.size + amt >= sizer.maxSize) {
	                    freeSpace -= sizer.maxSize - sizer.size;
	                    sizer.size = sizer.maxSize;
	                    sizer.done = true;
	                    notDoneCount--;
	                }
	                else {
	                    freeSpace -= amt;
	                    sizer.size += amt;
	                }
	            }
	        }
	    }
	}
	exports.boxCalc = boxCalc;
	/**
	 * (Re)initialize a box sizer's data for a layout pass.
	 */
	function initSizer(sizer) {
	    sizer.size = Math.max(sizer.minSize, Math.min(sizer.sizeHint, sizer.maxSize));
	    sizer.done = false;
	}
	//# sourceMappingURL=index.js.map

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var phosphor_disposable_1 = __webpack_require__(8);
	__webpack_require__(9);
	/**
	 * The class name added to the document body during cursor override.
	 */
	var OVERRIDE_CURSOR_CLASS = 'p-mod-override-cursor';
	/**
	 * The id for the active cursor override.
	 */
	var overrideID = 0;
	/**
	 * Override the cursor for the entire document.
	 *
	 * @param cursor - The string representing the cursor style.
	 *
	 * @returns A disposable which will clear the override when disposed.
	 *
	 * #### Notes
	 * The most recent call to `overrideCursor` takes precedence. Disposing
	 * an old override is a no-op and will not effect the current override.
	 *
	 * #### Example
	 * ```typescript
	 * import { overrideCursor } from 'phosphor-domutil';
	 *
	 * // force the cursor to be 'wait' for the entire document
	 * let override = overrideCursor('wait');
	 *
	 * // clear the override by disposing the return value
	 * override.dispose();
	 * ```
	 */
	function overrideCursor(cursor) {
	    var id = ++overrideID;
	    var body = document.body;
	    body.style.cursor = cursor;
	    body.classList.add(OVERRIDE_CURSOR_CLASS);
	    return new phosphor_disposable_1.DisposableDelegate(function () {
	        if (id === overrideID) {
	            body.style.cursor = '';
	            body.classList.remove(OVERRIDE_CURSOR_CLASS);
	        }
	    });
	}
	exports.overrideCursor = overrideCursor;
	/**
	 * Test whether a client position lies within a node.
	 *
	 * @param node - The DOM node of interest.
	 *
	 * @param clientX - The client X coordinate of interest.
	 *
	 * @param clientY - The client Y coordinate of interest.
	 *
	 * @returns `true` if the node covers the position, `false` otherwise.
	 *
	 * #### Example
	 * ```typescript
	 * import { hitTest } from 'phosphor-domutil';
	 *
	 * let div = document.createElement('div');
	 * div.style.position = 'absolute';
	 * div.style.left = '0px';
	 * div.style.top = '0px';
	 * div.style.width = '100px';
	 * div.style.height = '100px';
	 * document.body.appendChild(div);
	 *
	 * hitTest(div, 50, 50);   // true
	 * hitTest(div, 150, 150); // false
	 * ```
	 */
	function hitTest(node, clientX, clientY) {
	    var rect = node.getBoundingClientRect();
	    return (clientX >= rect.left &&
	        clientX < rect.right &&
	        clientY >= rect.top &&
	        clientY < rect.bottom);
	}
	exports.hitTest = hitTest;
	/**
	 * Compute the box sizing for a DOM node.
	 *
	 * @param node - The DOM node for which to compute the box sizing.
	 *
	 * @returns The box sizing data for the specified DOM node.
	 *
	 * #### Example
	 * ```typescript
	 * import { boxSizing } from 'phosphor-domutil';
	 *
	 * let div = document.createElement('div');
	 * div.style.borderTop = 'solid 10px black';
	 * document.body.appendChild(div);
	 *
	 * let sizing = boxSizing(div);
	 * sizing.borderTop;    // 10
	 * sizing.paddingLeft;  // 0
	 * // etc...
	 * ```
	 */
	function boxSizing(node) {
	    var cstyle = window.getComputedStyle(node);
	    var bt = parseInt(cstyle.borderTopWidth, 10) || 0;
	    var bl = parseInt(cstyle.borderLeftWidth, 10) || 0;
	    var br = parseInt(cstyle.borderRightWidth, 10) || 0;
	    var bb = parseInt(cstyle.borderBottomWidth, 10) || 0;
	    var pt = parseInt(cstyle.paddingTop, 10) || 0;
	    var pl = parseInt(cstyle.paddingLeft, 10) || 0;
	    var pr = parseInt(cstyle.paddingRight, 10) || 0;
	    var pb = parseInt(cstyle.paddingBottom, 10) || 0;
	    var hs = bl + pl + pr + br;
	    var vs = bt + pt + pb + bb;
	    return {
	        borderTop: bt,
	        borderLeft: bl,
	        borderRight: br,
	        borderBottom: bb,
	        paddingTop: pt,
	        paddingLeft: pl,
	        paddingRight: pr,
	        paddingBottom: pb,
	        horizontalSum: hs,
	        verticalSum: vs,
	    };
	}
	exports.boxSizing = boxSizing;
	/**
	 * Compute the size limits for a DOM node.
	 *
	 * @param node - The node for which to compute the size limits.
	 *
	 * @returns The size limit data for the specified DOM node.
	 *
	 * #### Example
	 * ```typescript
	 * import { sizeLimits } from 'phosphor-domutil';
	 *
	 * let div = document.createElement('div');
	 * div.style.minWidth = '90px';
	 * document.body.appendChild(div);
	 *
	 * let limits = sizeLimits(div);
	 * limits.minWidth;   // 90
	 * limits.maxHeight;  // Infinity
	 * // etc...
	 * ```
	 */
	function sizeLimits(node) {
	    var cstyle = window.getComputedStyle(node);
	    return {
	        minWidth: parseInt(cstyle.minWidth, 10) || 0,
	        minHeight: parseInt(cstyle.minHeight, 10) || 0,
	        maxWidth: parseInt(cstyle.maxWidth, 10) || Infinity,
	        maxHeight: parseInt(cstyle.maxHeight, 10) || Infinity,
	    };
	}
	exports.sizeLimits = sizeLimits;
	//# sourceMappingURL=index.js.map

/***/ },
/* 8 */
/***/ function(module, exports) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	/**
	 * A disposable object which delegates to a callback.
	 */
	var DisposableDelegate = (function () {
	    /**
	     * Construct a new disposable delegate.
	     *
	     * @param callback - The function to invoke when the delegate is
	     *   disposed.
	     */
	    function DisposableDelegate(callback) {
	        this._callback = callback || null;
	    }
	    Object.defineProperty(DisposableDelegate.prototype, "isDisposed", {
	        /**
	         * Test whether the delegate has been disposed.
	         *
	         * #### Notes
	         * This is a read-only property which is always safe to access.
	         */
	        get: function () {
	            return this._callback === null;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Dispose of the delegate and invoke its callback.
	     *
	     * #### Notes
	     * If this method is called more than once, all calls made after the
	     * first will be a no-op.
	     */
	    DisposableDelegate.prototype.dispose = function () {
	        if (this._callback === null) {
	            return;
	        }
	        var callback = this._callback;
	        this._callback = null;
	        callback();
	    };
	    return DisposableDelegate;
	})();
	exports.DisposableDelegate = DisposableDelegate;
	/**
	 * An object which manages a collection of disposable items.
	 */
	var DisposableSet = (function () {
	    /**
	     * Construct a new disposable set.
	     *
	     * @param items - The initial disposable items for the set.
	     */
	    function DisposableSet(items) {
	        var _this = this;
	        this._set = new Set();
	        if (items)
	            items.forEach(function (item) { _this._set.add(item); });
	    }
	    Object.defineProperty(DisposableSet.prototype, "isDisposed", {
	        /**
	         * Test whether the set has been disposed.
	         *
	         * #### Notes
	         * This is a read-only property which is always safe to access.
	         */
	        get: function () {
	            return this._set === null;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Dispose of the set and dispose the items it contains.
	     *
	     * #### Notes
	     * Items are disposed in the order they are added to the set.
	     *
	     * It is unsafe to use the set after it has been disposed.
	     *
	     * If this method is called more than once, all calls made after the
	     * first will be a no-op.
	     */
	    DisposableSet.prototype.dispose = function () {
	        if (this._set === null) {
	            return;
	        }
	        var set = this._set;
	        this._set = null;
	        set.forEach(function (item) { item.dispose(); });
	    };
	    /**
	     * Add a disposable item to the set.
	     *
	     * @param item - The disposable item to add to the set. If the item
	     *   is already contained in the set, this is a no-op.
	     *
	     * @throws Will throw an error if the set has been disposed.
	     */
	    DisposableSet.prototype.add = function (item) {
	        if (this._set === null) {
	            throw new Error('object is disposed');
	        }
	        this._set.add(item);
	    };
	    /**
	     * Remove a disposable item from the set.
	     *
	     * @param item - The disposable item to remove from the set. If the
	     *   item does not exist in the set, this is a no-op.
	     *
	     * @throws Will throw an error if the set has been disposed.
	     */
	    DisposableSet.prototype.remove = function (item) {
	        if (this._set === null) {
	            throw new Error('object is disposed');
	        }
	        this._set.delete(item);
	    };
	    /**
	     * Clear all disposable items from the set.
	     *
	     * @throws Will throw an error if the set has been disposed.
	     */
	    DisposableSet.prototype.clear = function () {
	        if (this._set === null) {
	            throw new Error('object is disposed');
	        }
	        this._set.clear();
	    };
	    return DisposableSet;
	})();
	exports.DisposableSet = DisposableSet;
	//# sourceMappingURL=index.js.map

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./index.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./index.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, "/*-----------------------------------------------------------------------------\r\n| Copyright (c) 2014-2015, PhosphorJS Contributors\r\n|\r\n| Distributed under the terms of the BSD 3-Clause License.\r\n|\r\n| The full license is in the file LICENSE, distributed with this software.\r\n|----------------------------------------------------------------------------*/\r\nbody.p-mod-override-cursor * {\r\n  cursor: inherit !important;\r\n}\r\n", ""]);

	// exports


/***/ },
/* 11 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(true) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var phosphor_queue_1 = __webpack_require__(16);
	/**
	 * A message which can be sent or posted to a message handler.
	 *
	 * #### Notes
	 * This class may be subclassed to create complex message types.
	 *
	 * **See Also** [[postMessage]] and [[sendMessage]].
	 */
	var Message = (function () {
	    /**
	     * Construct a new message.
	     *
	     * @param type - The type of the message. Consumers of a message will
	     *   use this value to cast the message to the appropriately derived
	     *   message type.
	     */
	    function Message(type) {
	        this._type = type;
	    }
	    Object.defineProperty(Message.prototype, "type", {
	        /**
	         * Get the type of the message.
	         */
	        get: function () {
	            return this._type;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Message;
	})();
	exports.Message = Message;
	/**
	 * Send a message to the message handler to process immediately.
	 *
	 * @param handler - The handler which should process the message.
	 *
	 * @param msg - The message to send to the handler.
	 *
	 * #### Notes
	 * Unlike [[postMessage]], [[sendMessage]] delivers the message to
	 * the handler immediately. The handler will not have the opportunity
	 * to compress the message, however the message will still be sent
	 * through any installed message filters.
	 *
	 * **See Also** [[postMessage]].
	 */
	function sendMessage(handler, msg) {
	    getDispatcher(handler).sendMessage(handler, msg);
	}
	exports.sendMessage = sendMessage;
	/**
	 * Post a message to the message handler to process in the future.
	 *
	 * @param handler - The handler which should process the message.
	 *
	 * @param msg - The message to post to the handler.
	 *
	 * #### Notes
	 * Unlike [[sendMessage]], [[postMessage]] will schedule the deliver of
	 * the message for the next cycle of the event loop. The handler will
	 * have the opportunity to compress the message in order to optimize
	 * its handling of similar messages. The message will be sent through
	 * any installed message filters before being delivered to the handler.
	 *
	 * **See Also** [[sendMessage]].
	 */
	function postMessage(handler, msg) {
	    getDispatcher(handler).postMessage(handler, msg);
	}
	exports.postMessage = postMessage;
	/**
	 * Test whether a message handler has posted messages pending delivery.
	 *
	 * @param handler - The message handler of interest.
	 *
	 * @returns `true` if the handler has pending posted messages, `false`
	 *   otherwise.
	 *
	 * **See Also** [[sendPendingMessage]].
	 */
	function hasPendingMessages(handler) {
	    return getDispatcher(handler).hasPendingMessages();
	}
	exports.hasPendingMessages = hasPendingMessages;
	/**
	 * Send the first pending posted message to the message handler.
	 *
	 * @param handler - The message handler of interest.
	 *
	 * #### Notes
	 * If the handler has no pending messages, this is a no-op.
	 *
	 * **See Also** [[hasPendingMessages]].
	 */
	function sendPendingMessage(handler) {
	    getDispatcher(handler).sendPendingMessage(handler);
	}
	exports.sendPendingMessage = sendPendingMessage;
	/**
	 * Install a message filter for a message handler.
	 *
	 * A message filter is invoked before the message handler processes a
	 * message. If the filter returns `true` from its [[filterMessage]] method,
	 * no other filters will be invoked, and the message will not be delivered.
	 *
	 * The most recently installed message filter is executed first.
	 *
	 * @param handler - The handler whose messages should be filtered.
	 *
	 * @param filter - The filter to install for the handler.
	 *
	 * #### Notes
	 * It is possible to install the same filter multiple times. If the
	 * filter should be unique, call [[removeMessageFilter]] first.
	 *
	 * **See Also** [[removeMessageFilter]].
	 */
	function installMessageFilter(handler, filter) {
	    getDispatcher(handler).installMessageFilter(filter);
	}
	exports.installMessageFilter = installMessageFilter;
	/**
	 * Remove a previously installed message filter for a message handler.
	 *
	 * @param handler - The handler for which the filter is installed.
	 *
	 * @param filter - The filter to remove.
	 *
	 * #### Notes
	 * This will remove **all** occurrences of the filter. If the filter is
	 * not installed, this is a no-op.
	 *
	 * It is safe to call this function while the filter is executing.
	 *
	 * **See Also** [[installMessageFilter]].
	 */
	function removeMessageFilter(handler, filter) {
	    getDispatcher(handler).removeMessageFilter(filter);
	}
	exports.removeMessageFilter = removeMessageFilter;
	/**
	 * Clear all message data associated with the message handler.
	 *
	 * @param handler - The message handler for which to clear the data.
	 *
	 * #### Notes
	 * This will remove all pending messages and filters for the handler.
	 */
	function clearMessageData(handler) {
	    var dispatcher = dispatcherMap.get(handler);
	    if (dispatcher)
	        dispatcher.clear();
	    dispatchQueue.removeAll(handler);
	}
	exports.clearMessageData = clearMessageData;
	/**
	 * The internal mapping of message handler to message dispatcher
	 */
	var dispatcherMap = new WeakMap();
	/**
	 * The internal queue of pending message handlers.
	 */
	var dispatchQueue = new phosphor_queue_1.Queue();
	/**
	 * The internal animation frame id for the message loop wake up call.
	 */
	var frameId = void 0;
	/**
	 * A local reference to an event loop hook.
	 */
	var raf;
	if (typeof requestAnimationFrame === 'function') {
	    raf = requestAnimationFrame;
	}
	else {
	    raf = setImmediate;
	}
	/**
	 * Get or create the message dispatcher for a message handler.
	 */
	function getDispatcher(handler) {
	    var dispatcher = dispatcherMap.get(handler);
	    if (dispatcher)
	        return dispatcher;
	    dispatcher = new MessageDispatcher();
	    dispatcherMap.set(handler, dispatcher);
	    return dispatcher;
	}
	/**
	 * Wake up the message loop to process any pending dispatchers.
	 *
	 * This is a no-op if a wake up is not needed or is already pending.
	 */
	function wakeUpMessageLoop() {
	    if (frameId === void 0 && !dispatchQueue.empty) {
	        frameId = raf(runMessageLoop);
	    }
	}
	/**
	 * Run an iteration of the message loop.
	 *
	 * This will process all pending dispatchers in the queue. Dispatchers
	 * which are added to the queue while the message loop is running will
	 * be processed on the next message loop cycle.
	 */
	function runMessageLoop() {
	    // Clear the frame id so the next wake up call can be scheduled.
	    frameId = void 0;
	    // If the queue is empty, there is nothing else to do.
	    if (dispatchQueue.empty) {
	        return;
	    }
	    // Add a null sentinel value to the end of the queue. The queue
	    // will only be processed up to the first null value. This means
	    // that messages posted during this cycle will execute on the next
	    // cycle of the loop.
	    dispatchQueue.push(null);
	    // The message dispatch loop. If the dispatcher is the null sentinel,
	    // the processing of the current block of messages is complete and
	    // another loop is scheduled. Otherwise, the pending message is
	    // dispatched to the message handler.
	    while (!dispatchQueue.empty) {
	        var handler = dispatchQueue.pop();
	        if (handler === null) {
	            wakeUpMessageLoop();
	            return;
	        }
	        getDispatcher(handler).sendPendingMessage(handler);
	    }
	}
	/**
	 * Safely process a message for a message handler.
	 *
	 * If the handler throws an exception, it will be caught and logged.
	 */
	function safeProcess(handler, msg) {
	    try {
	        handler.processMessage(msg);
	    }
	    catch (err) {
	        console.error(err);
	    }
	}
	/**
	 * Safely compress a message for a message handler.
	 *
	 * If the handler throws an exception, it will be caught and logged.
	 */
	function safeCompress(handler, msg, queue) {
	    var result = false;
	    try {
	        result = handler.compressMessage(msg, queue);
	    }
	    catch (err) {
	        console.error(err);
	    }
	    return result;
	}
	/**
	 * Safely filter a message for a message handler.
	 *
	 * If the filter throws an exception, it will be caught and logged.
	 */
	function safeFilter(filter, handler, msg) {
	    var result = false;
	    try {
	        result = filter.filterMessage(handler, msg);
	    }
	    catch (err) {
	        console.error(err);
	    }
	    return result;
	}
	/**
	 * An internal class which manages message dispatching for a handler.
	 */
	var MessageDispatcher = (function () {
	    function MessageDispatcher() {
	        this._filters = null;
	        this._messages = null;
	    }
	    /**
	     * Send a message to the handler immediately.
	     *
	     * The message will first be sent through installed filters.
	     */
	    MessageDispatcher.prototype.sendMessage = function (handler, msg) {
	        if (!this._filterMessage(handler, msg)) {
	            safeProcess(handler, msg);
	        }
	    };
	    /**
	     * Post a message for delivery in the future.
	     *
	     * The message will first be compressed if possible.
	     */
	    MessageDispatcher.prototype.postMessage = function (handler, msg) {
	        if (!this._compressMessage(handler, msg)) {
	            this._enqueueMessage(handler, msg);
	        }
	    };
	    /**
	     * Test whether the dispatcher has messages pending delivery.
	     */
	    MessageDispatcher.prototype.hasPendingMessages = function () {
	        return !!(this._messages && !this._messages.empty);
	    };
	    /**
	     * Send the first pending message to the message handler.
	     */
	    MessageDispatcher.prototype.sendPendingMessage = function (handler) {
	        if (this._messages && !this._messages.empty) {
	            this.sendMessage(handler, this._messages.pop());
	        }
	    };
	    /**
	     * Install a message filter for the dispatcher.
	     */
	    MessageDispatcher.prototype.installMessageFilter = function (filter) {
	        this._filters = { next: this._filters, filter: filter };
	    };
	    /**
	     * Remove all occurrences of a message filter from the dispatcher.
	     */
	    MessageDispatcher.prototype.removeMessageFilter = function (filter) {
	        var link = this._filters;
	        var prev = null;
	        while (link !== null) {
	            if (link.filter === filter) {
	                link.filter = null;
	            }
	            else if (prev === null) {
	                this._filters = link;
	                prev = link;
	            }
	            else {
	                prev.next = link;
	                prev = link;
	            }
	            link = link.next;
	        }
	        if (!prev) {
	            this._filters = null;
	        }
	        else {
	            prev.next = null;
	        }
	    };
	    /**
	     * Clear all messages and filters from the dispatcher.
	     */
	    MessageDispatcher.prototype.clear = function () {
	        if (this._messages) {
	            this._messages.clear();
	        }
	        for (var link = this._filters; link !== null; link = link.next) {
	            link.filter = null;
	        }
	        this._filters = null;
	    };
	    /**
	     * Run the installed message filters for the handler.
	     *
	     * Returns `true` if the message was filtered, `false` otherwise.
	     */
	    MessageDispatcher.prototype._filterMessage = function (handler, msg) {
	        for (var link = this._filters; link !== null; link = link.next) {
	            if (link.filter && safeFilter(link.filter, handler, msg)) {
	                return true;
	            }
	        }
	        return false;
	    };
	    /**
	     * Compress the mssage for the given handler.
	     *
	     * Returns `true` if the message was compressed, `false` otherwise.
	     */
	    MessageDispatcher.prototype._compressMessage = function (handler, msg) {
	        if (!handler.compressMessage) {
	            return false;
	        }
	        if (!this._messages || this._messages.empty) {
	            return false;
	        }
	        return safeCompress(handler, msg, this._messages);
	    };
	    /**
	     * Enqueue the message for future delivery to the handler.
	     */
	    MessageDispatcher.prototype._enqueueMessage = function (handler, msg) {
	        this._ensureMessages().push(msg);
	        dispatchQueue.push(handler);
	        wakeUpMessageLoop();
	    };
	    /**
	     * Get the internal message queue, creating it if needed.
	     */
	    MessageDispatcher.prototype._ensureMessages = function () {
	        return this._messages || (this._messages = new phosphor_queue_1.Queue());
	    };
	    return MessageDispatcher;
	})();
	//# sourceMappingURL=index.js.map
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14).setImmediate))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(15).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

	  immediateIds[id] = true;

	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });

	  return id;
	};

	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(14).setImmediate, __webpack_require__(14).clearImmediate))

/***/ },
/* 15 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 16 */
/***/ function(module, exports) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	/**
	 * A generic FIFO queue data structure.
	 *
	 * #### Notes
	 * This queue is implemented internally using a singly linked list and
	 * can grow to arbitrary size.
	 *
	 * #### Example
	 * ```typescript
	 * let q = new Queue<number>([0, 1, 2]);
	 * q.size;      // 3
	 * q.empty;     // false
	 * q.pop();     // 0
	 * q.pop();     // 1
	 * q.push(42);  // undefined
	 * q.size;      // 2
	 * q.pop();     // 2
	 * q.pop();     // 42
	 * q.pop();     // undefined
	 * q.size;      // 0
	 * q.empty;     // true
	 * ```
	 */
	var Queue = (function () {
	    /**
	     * Construct a new queue.
	     *
	     * @param items - The initial items for the queue.
	     */
	    function Queue(items) {
	        var _this = this;
	        this._size = 0;
	        this._front = null;
	        this._back = null;
	        if (items)
	            items.forEach(function (item) { return _this.push(item); });
	    }
	    Object.defineProperty(Queue.prototype, "size", {
	        /**
	         * Get the number of elements in the queue.
	         *
	         * #### Notes
	         * This has `O(1)` complexity.
	         */
	        get: function () {
	            return this._size;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Queue.prototype, "empty", {
	        /**
	         * Test whether the queue is empty.
	         *
	         * #### Notes
	         * This has `O(1)` complexity.
	         */
	        get: function () {
	            return this._size === 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Queue.prototype, "front", {
	        /**
	         * Get the value at the front of the queue.
	         *
	         * #### Notes
	         * This has `O(1)` complexity.
	         *
	         * If the queue is empty, this value will be `undefined`.
	         */
	        get: function () {
	            return this._front !== null ? this._front.value : void 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Queue.prototype, "back", {
	        /**
	         * Get the value at the back of the queue.
	         *
	         * #### Notes
	         * This has `O(1)` complexity.
	         *
	         * If the queue is empty, this value will be `undefined`.
	         */
	        get: function () {
	            return this._back !== null ? this._back.value : void 0;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Push a value onto the back of the queue.
	     *
	     * @param value - The value to add to the queue.
	     *
	     * #### Notes
	     * This has `O(1)` complexity.
	     */
	    Queue.prototype.push = function (value) {
	        var link = { next: null, value: value };
	        if (this._back === null) {
	            this._front = link;
	            this._back = link;
	        }
	        else {
	            this._back.next = link;
	            this._back = link;
	        }
	        this._size++;
	    };
	    /**
	     * Pop and return the value at the front of the queue.
	     *
	     * @returns The value at the front of the queue.
	     *
	     * #### Notes
	     * This has `O(1)` complexity.
	     *
	     * If the queue is empty, the return value will be `undefined`.
	     */
	    Queue.prototype.pop = function () {
	        var link = this._front;
	        if (link === null) {
	            return void 0;
	        }
	        if (link.next === null) {
	            this._front = null;
	            this._back = null;
	        }
	        else {
	            this._front = link.next;
	        }
	        this._size--;
	        return link.value;
	    };
	    /**
	     * Remove the first occurrence of a value from the queue.
	     *
	     * @param value - The value to remove from the queue.
	     *
	     * @returns `true` on success, `false` otherwise.
	     *
	     * #### Notes
	     * This has `O(N)` complexity.
	     */
	    Queue.prototype.remove = function (value) {
	        var link = this._front;
	        var prev = null;
	        while (link !== null) {
	            if (link.value === value) {
	                if (prev === null) {
	                    this._front = link.next;
	                }
	                else {
	                    prev.next = link.next;
	                }
	                if (link.next === null) {
	                    this._back = prev;
	                }
	                this._size--;
	                return true;
	            }
	            prev = link;
	            link = link.next;
	        }
	        return false;
	    };
	    /**
	     * Remove all occurrences of a value from the queue.
	     *
	     * @param value - The value to remove from the queue.
	     *
	     * @returns The number of occurrences removed.
	     *
	     * #### Notes
	     * This has `O(N)` complexity.
	     */
	    Queue.prototype.removeAll = function (value) {
	        var count = 0;
	        var link = this._front;
	        var prev = null;
	        while (link !== null) {
	            if (link.value === value) {
	                count++;
	                this._size--;
	            }
	            else if (prev === null) {
	                this._front = link;
	                prev = link;
	            }
	            else {
	                prev.next = link;
	                prev = link;
	            }
	            link = link.next;
	        }
	        if (!prev) {
	            this._front = null;
	            this._back = null;
	        }
	        else {
	            prev.next = null;
	            this._back = prev;
	        }
	        return count;
	    };
	    /**
	     * Remove all values from the queue.
	     *
	     * #### Notes
	     * This has `O(1)` complexity.
	     */
	    Queue.prototype.clear = function () {
	        this._size = 0;
	        this._front = null;
	        this._back = null;
	    };
	    /**
	     * Create an array from the values in the queue.
	     *
	     * @returns An array of all values in the queue.
	     *
	     * #### Notes
	     * This has `O(N)` complexity.
	     */
	    Queue.prototype.toArray = function () {
	        var result = new Array(this._size);
	        for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
	            result[i] = link.value;
	        }
	        return result;
	    };
	    /**
	     * Test whether any value in the queue passes a predicate function.
	     *
	     * @param pred - The predicate to apply to the values.
	     *
	     * @returns `true` if any value in the queue passes the predicate,
	     *   or `false` otherwise.
	     *
	     * #### Notes
	     * This has `O(N)` complexity.
	     *
	     * It is **not** safe for the predicate to modify the queue while
	     * iterating.
	     */
	    Queue.prototype.some = function (pred) {
	        for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
	            if (pred(link.value, i))
	                return true;
	        }
	        return false;
	    };
	    /**
	     * Test whether all values in the queue pass a predicate function.
	     *
	     * @param pred - The predicate to apply to the values.
	     *
	     * @returns `true` if all values in the queue pass the predicate,
	     *   or `false` otherwise.
	     *
	     * #### Notes
	     * This has `O(N)` complexity.
	     *
	     * It is **not** safe for the predicate to modify the queue while
	     * iterating.
	     */
	    Queue.prototype.every = function (pred) {
	        for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
	            if (!pred(link.value, i))
	                return false;
	        }
	        return true;
	    };
	    /**
	     * Create an array of the values which pass a predicate function.
	     *
	     * @param pred - The predicate to apply to the values.
	     *
	     * @returns The array of values which pass the predicate.
	     *
	     * #### Notes
	     * This has `O(N)` complexity.
	     *
	     * It is **not** safe for the predicate to modify the queue while
	     * iterating.
	     */
	    Queue.prototype.filter = function (pred) {
	        var result = [];
	        for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
	            if (pred(link.value, i))
	                result.push(link.value);
	        }
	        return result;
	    };
	    /**
	     * Create an array of mapped values for the values in the queue.
	     *
	     * @param callback - The map function to apply to the values.
	     *
	     * @returns The array of values returned by the map function.
	     *
	     * #### Notes
	     * This has `O(N)` complexity.
	     *
	     * It is **not** safe for the callback to modify the queue while
	     * iterating.
	     */
	    Queue.prototype.map = function (callback) {
	        var result = new Array(this._size);
	        for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
	            result[i] = callback(link.value, i);
	        }
	        return result;
	    };
	    /**
	     * Execute a callback for each value in the queue.
	     *
	     * @param callback - The function to apply to the values.
	     *
	     * @returns The first value returned by the callback which is not
	     *   `undefined`.
	     *
	     * #### Notes
	     * This has `O(N)` complexity.
	     *
	     * Iteration will terminate immediately if the callback returns any
	     * value other than `undefined`.
	     *
	     * It is **not** safe for the callback to modify the queue while
	     * iterating.
	     */
	    Queue.prototype.forEach = function (callback) {
	        for (var i = 0, link = this._front; link !== null; link = link.next, ++i) {
	            var result = callback(link.value, i);
	            if (result !== void 0)
	                return result;
	        }
	        return void 0;
	    };
	    return Queue;
	})();
	exports.Queue = Queue;
	//# sourceMappingURL=index.js.map

/***/ },
/* 17 */
/***/ function(module, exports) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	/**
	 * A property descriptor for a datum belonging to an object.
	 *
	 * Property descriptors can be used to expose a rich interface for an
	 * object which encapsulates value creation, coercion, and notification.
	 * They can also be used to extend the state of an object with semantic
	 * data from an unrelated class.
	 */
	var Property = (function () {
	    /**
	     * Construct a new property descriptor.
	     *
	     * @param options - The options for initializing the property.
	     */
	    function Property(options) {
	        this._pid = nextPID();
	        this._name = options.name;
	        this._value = options.value;
	        this._create = options.create;
	        this._coerce = options.coerce;
	        this._compare = options.compare;
	        this._changed = options.changed;
	        this._notify = options.notify;
	    }
	    Object.defineProperty(Property.prototype, "name", {
	        /**
	         * Get the human readable name for the property.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._name;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Property.prototype, "notify", {
	        /**
	         * Get the notify signal for the property.
	         *
	         * #### Notes
	         * This will be `undefined` if no notify signal was provided.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._notify;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Get the current value of the property for a given owner.
	     *
	     * @param owner - The property owner of interest.
	     *
	     * @returns The current value of the property.
	     *
	     * #### Notes
	     * If the value has not yet been set, the default value will be
	     * computed and assigned as the current value of the property.
	     */
	    Property.prototype.get = function (owner) {
	        var value;
	        var hash = lookupHash(owner);
	        if (this._pid in hash) {
	            value = hash[this._pid];
	        }
	        else {
	            value = hash[this._pid] = this._createValue(owner);
	        }
	        return value;
	    };
	    /**
	     * Set the current value of the property for a given owner.
	     *
	     * @param owner - The property owner of interest.
	     *
	     * @param value - The value for the property.
	     *
	     * #### Notes
	     * If the value has not yet been set, the default value will be
	     * computed and used as the previous value for the comparison.
	     */
	    Property.prototype.set = function (owner, value) {
	        var oldValue;
	        var hash = lookupHash(owner);
	        if (this._pid in hash) {
	            oldValue = hash[this._pid];
	        }
	        else {
	            oldValue = hash[this._pid] = this._createValue(owner);
	        }
	        var newValue = this._coerceValue(owner, value);
	        this._maybeNotify(owner, oldValue, hash[this._pid] = newValue);
	    };
	    /**
	     * Explicitly coerce the current property value for a given owner.
	     *
	     * @param owner - The property owner of interest.
	     *
	     * #### Notes
	     * If the value has not yet been set, the default value will be
	     * computed and used as the previous value for the comparison.
	     */
	    Property.prototype.coerce = function (owner) {
	        var oldValue;
	        var hash = lookupHash(owner);
	        if (this._pid in hash) {
	            oldValue = hash[this._pid];
	        }
	        else {
	            oldValue = hash[this._pid] = this._createValue(owner);
	        }
	        var newValue = this._coerceValue(owner, oldValue);
	        this._maybeNotify(owner, oldValue, hash[this._pid] = newValue);
	    };
	    /**
	     * Get or create the default value for the given owner.
	     */
	    Property.prototype._createValue = function (owner) {
	        var create = this._create;
	        return create ? create(owner) : this._value;
	    };
	    /**
	     * Coerce the value for the given owner.
	     */
	    Property.prototype._coerceValue = function (owner, value) {
	        var coerce = this._coerce;
	        return coerce ? coerce(owner, value) : value;
	    };
	    /**
	     * Compare the old value and new value for equality.
	     */
	    Property.prototype._compareValue = function (oldValue, newValue) {
	        var compare = this._compare;
	        return compare ? compare(oldValue, newValue) : oldValue === newValue;
	    };
	    /**
	     * Run the change notification if the given values are different.
	     */
	    Property.prototype._maybeNotify = function (owner, oldValue, newValue) {
	        var changed = this._changed;
	        var notify = this._notify;
	        if (!changed && !notify) {
	            return;
	        }
	        if (this._compareValue(oldValue, newValue)) {
	            return;
	        }
	        if (changed) {
	            changed(owner, oldValue, newValue);
	        }
	        if (notify) {
	            notify.bind(owner).emit({ name: this._name, oldValue: oldValue, newValue: newValue });
	        }
	    };
	    return Property;
	})();
	exports.Property = Property;
	/**
	 * Clear the stored property data for the given property owner.
	 *
	 * @param owner - The property owner of interest.
	 *
	 * #### Notes
	 * This will clear all property values for the owner, but it will
	 * **not** run the change notification for any of the properties.
	 */
	function clearPropertyData(owner) {
	    ownerData.delete(owner);
	}
	exports.clearPropertyData = clearPropertyData;
	/**
	 * A weak mapping of property owner to property hash.
	 */
	var ownerData = new WeakMap();
	/**
	 * A function which computes successive unique property ids.
	 */
	var nextPID = (function () { var id = 0; return function () { return 'pid-' + id++; }; })();
	/**
	 * Lookup the data hash for the property owner.
	 *
	 * This will create the hash if one does not already exist.
	 */
	function lookupHash(owner) {
	    var hash = ownerData.get(owner);
	    if (hash !== void 0)
	        return hash;
	    hash = Object.create(null);
	    ownerData.set(owner, hash);
	    return hash;
	}
	//# sourceMappingURL=index.js.map

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(19));
	__export(__webpack_require__(28));


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var arrays = __webpack_require__(3);
	var phosphor_messaging_1 = __webpack_require__(13);
	var phosphor_widget_1 = __webpack_require__(20);
	/**
	 * A concrete layout implementation suitable for many use cases.
	 *
	 * #### Notes
	 * This class is suitable as a base class for implementing a variety of
	 * layouts, but can also be used directly with standard CSS to layout a
	 * collection of widgets.
	 */
	var PanelLayout = (function (_super) {
	    __extends(PanelLayout, _super);
	    function PanelLayout() {
	        _super.apply(this, arguments);
	        this._children = [];
	    }
	    /**
	     * Dispose of the resources held by the layout.
	     *
	     * #### Notes
	     * This will dispose all current child widgets of the layout.
	     */
	    PanelLayout.prototype.dispose = function () {
	        while (this._children.length > 0) {
	            this._children.pop().dispose();
	        }
	        _super.prototype.dispose.call(this);
	    };
	    /**
	     * Get the number of child widgets in the layout.
	     *
	     * @returns The number of child widgets in the layout.
	     */
	    PanelLayout.prototype.childCount = function () {
	        return this._children.length;
	    };
	    /**
	     * Get the child widget at the specified index.
	     *
	     * @param index - The index of the child widget of interest.
	     *
	     * @returns The child at the specified index, or `undefined`.
	     */
	    PanelLayout.prototype.childAt = function (index) {
	        return this._children[index];
	    };
	    /**
	     * Add a child widget to the end of the layout.
	     *
	     * @param child - The child widget to add to the layout.
	     *
	     * #### Notes
	     * If the child is already contained in the layout, it will be moved.
	     */
	    PanelLayout.prototype.addChild = function (child) {
	        this.insertChild(this.childCount(), child);
	    };
	    /**
	     * Insert a child widget into the layout at the specified index.
	     *
	     * @param index - The index at which to insert the child widget.
	     *
	     * @param child - The child widget to insert into the layout.
	     *
	     * #### Notes
	     * If the child is already contained in the layout, it will be moved.
	     */
	    PanelLayout.prototype.insertChild = function (index, child) {
	        child.parent = this.parent;
	        var n = this._children.length;
	        var i = this._children.indexOf(child);
	        var j = Math.max(0, Math.min(index | 0, n));
	        if (i !== -1) {
	            if (j === n)
	                j--;
	            if (i === j)
	                return;
	            arrays.move(this._children, i, j);
	            if (this.parent)
	                this.moveChild(i, j, child);
	        }
	        else {
	            arrays.insert(this._children, j, child);
	            if (this.parent)
	                this.attachChild(j, child);
	        }
	    };
	    /**
	     * Remove a child widget from the layout.
	     *
	     * @param child - The child widget to remove from the layout.
	     *
	     * #### Notes
	     * A child widget will be removed from the layout automatically when
	     * its `parent` is set to `null`. This method should only be invoked
	     * directly when removing a widget from a layout which has yet to be
	     * installed on a parent widget.
	     *
	     * This method does *not* modify the widget's `parent`.
	     *
	     * If the child is not contained in the layout, this is a no-op.
	     */
	    PanelLayout.prototype.removeChild = function (child) {
	        var i = arrays.remove(this._children, child);
	        if (i !== -1 && this.parent)
	            this.detachChild(i, child);
	    };
	    /**
	     * Initialize the children of the layout.
	     *
	     * #### Notes
	     * This method is called automatically when the layout is installed
	     * on its parent widget.
	     *
	     * This may be reimplemented by subclasses as needed.
	     */
	    PanelLayout.prototype.initialize = function () {
	        for (var i = 0; i < this.childCount(); ++i) {
	            var child = this.childAt(i);
	            child.parent = this.parent;
	            this.attachChild(i, child);
	        }
	    };
	    /**
	     * Attach a child widget to the parent's DOM node.
	     *
	     * @param index - The current index of the child in the layout.
	     *
	     * @param child - The child widget to attach to the parent.
	     *
	     * #### Notes
	     * This method is called automatically by the panel layout at the
	     * appropriate time. It should not be called directly by user code.
	     *
	     * The default implementation adds the child's node to the parent's
	     * node at the proper location, and sends an `'after-attach'` message
	     * to the child if the parent is attached to the DOM.
	     *
	     * Subclasses may reimplement this method to control how the child's
	     * node is added to the parent's node, but the reimplementation must
	     * send an `'after-attach'` message to the child if the parent is
	     * attached to the DOM.
	     */
	    PanelLayout.prototype.attachChild = function (index, child) {
	        var ref = this.parent.node.children[index];
	        this.parent.node.insertBefore(child.node, ref);
	        if (this.parent.isAttached)
	            phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgAfterAttach);
	    };
	    /**
	     * Move a child widget in the parent's DOM node.
	     *
	     * @param fromIndex - The previous index of the child in the layout.
	     *
	     * @param toIndex - The current index of the child in the layout.
	     *
	     * @param child - The child widget to move in the parent.
	     *
	     * #### Notes
	     * This method is called automatically by the panel layout at the
	     * appropriate time. It should not be called directly by user code.
	     *
	     * The default implementation moves the child's node to the proper
	     * location in the parent's node and sends both a `'before-detach'`
	     * and an `'after-attach'` message to the child if the parent is
	     * attached to the DOM.
	     *
	     * Subclasses may reimplement this method to control how the child's
	     * node is moved in the parent's node, but the reimplementation must
	     * send both a `'before-detach'` and an `'after-attach'` message to
	     * the child if the parent is attached to the DOM.
	     */
	    PanelLayout.prototype.moveChild = function (fromIndex, toIndex, child) {
	        if (this.parent.isAttached)
	            phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgBeforeDetach);
	        this.parent.node.removeChild(child.node);
	        var ref = this.parent.node.children[toIndex];
	        this.parent.node.insertBefore(child.node, ref);
	        if (this.parent.isAttached)
	            phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgAfterAttach);
	    };
	    /**
	     * Detach a child widget from the parent's DOM node.
	     *
	     * @param index - The previous index of the child in the layout.
	     *
	     * @param child - The child widget to detach from the parent.
	     *
	     * #### Notes
	     * This method is called automatically by the panel layout at the
	     * appropriate time. It should not be called directly by user code.
	     *
	     * The default implementation removes the child's node from the
	     * parent's node, and sends a `'before-detach'` message to the child
	     * if the parent is attached to the DOM.
	     *
	     * Subclasses may reimplement this method to control how the child's
	     * node is removed from the parent's node, but the reimplementation
	     * must send a `'before-detach'` message to the child if the parent
	     * is attached to the DOM.
	     */
	    PanelLayout.prototype.detachChild = function (index, child) {
	        if (this.parent.isAttached)
	            phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgBeforeDetach);
	        this.parent.node.removeChild(child.node);
	    };
	    /**
	     * A message handler invoked on a `'child-removed'` message.
	     *
	     * #### Notes
	     * This will remove the child from the layout.
	     *
	     * Subclasses should **not** typically reimplement this method.
	     */
	    PanelLayout.prototype.onChildRemoved = function (msg) {
	        this.removeChild(msg.child);
	    };
	    return PanelLayout;
	})(phosphor_widget_1.AbstractLayout);
	exports.PanelLayout = PanelLayout;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(21));
	__export(__webpack_require__(25));
	__export(__webpack_require__(23));
	__webpack_require__(26);


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var phosphor_messaging_1 = __webpack_require__(13);
	var phosphor_properties_1 = __webpack_require__(17);
	var phosphor_signaling_1 = __webpack_require__(22);
	var widget_1 = __webpack_require__(23);
	/**
	 * The abstract base class of all Phosphor layouts.
	 *
	 * #### Notes
	 * A layout is used to add child widgets to a parent and to arrange
	 * those children within the parent's node.
	 *
	 * This class must be subclassed to make a fully functioning layout.
	 */
	var Layout = (function () {
	    function Layout() {
	        this._disposed = false;
	        this._parent = null;
	    }
	    /**
	     * Dispose of the resources held by the layout.
	     *
	     * #### Notes
	     * This method should be reimplemented by subclasses to dispose their
	     * children. All reimplementations should call the superclass method.
	     */
	    Layout.prototype.dispose = function () {
	        this._disposed = true;
	        this._parent = null;
	        phosphor_signaling_1.clearSignalData(this);
	        phosphor_properties_1.clearPropertyData(this);
	    };
	    Object.defineProperty(Layout.prototype, "isDisposed", {
	        /**
	         * Test whether the layout is disposed.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._disposed;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Layout.prototype, "parent", {
	        /**
	         * Get the parent widget of the layout.
	         */
	        get: function () {
	            return this._parent;
	        },
	        /**
	         * Set the parent widget of the layout.
	         *
	         * #### Notes
	         * This is set automatically when installing the layout on the parent
	         * widget. The layout parent should not be set directly by user code.
	         */
	        set: function (value) {
	            if (!value) {
	                throw new Error('Cannot set layout parent to null.');
	            }
	            if (this._parent === value) {
	                return;
	            }
	            if (this._parent) {
	                throw new Error('Cannot change layout parent.');
	            }
	            if (value.layout !== this) {
	                throw new Error('Invalid layout parent.');
	            }
	            this._parent = value;
	            this.initialize();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Process a message sent to the parent widget.
	     *
	     * @param msg - The message sent to the parent widget.
	     *
	     * #### Notes
	     * This method is called by the parent to process a message.
	     *
	     * Subclasses may reimplement this method as needed.
	     */
	    Layout.prototype.processParentMessage = function (msg) {
	        switch (msg.type) {
	            case 'resize':
	                this.onResize(msg);
	                break;
	            case 'update-request':
	                this.onUpdateRequest(msg);
	                break;
	            case 'fit-request':
	                this.onFitRequest(msg);
	                break;
	            case 'after-attach':
	                this.onAfterAttach(msg);
	                break;
	            case 'before-detach':
	                this.onBeforeDetach(msg);
	                break;
	            case 'after-show':
	                this.onAfterShow(msg);
	                break;
	            case 'before-hide':
	                this.onBeforeHide(msg);
	                break;
	            case 'child-removed':
	                this.onChildRemoved(msg);
	                break;
	            case 'child-shown':
	                this.onChildShown(msg);
	                break;
	            case 'child-hidden':
	                this.onChildHidden(msg);
	                break;
	        }
	    };
	    /**
	     * A message handler invoked on a `'fit-request'` message.
	     *
	     * The default implementation of this handler is a no-op.
	     */
	    Layout.prototype.onFitRequest = function (msg) { };
	    /**
	     * A message handler invoked on a `'child-shown'` message.
	     *
	     * The default implementation of this handler is a no-op.
	     */
	    Layout.prototype.onChildShown = function (msg) { };
	    /**
	     * A message handler invoked on a `'child-hidden'` message.
	     *
	     * The default implementation of this handler is a no-op.
	     */
	    Layout.prototype.onChildHidden = function (msg) { };
	    return Layout;
	})();
	exports.Layout = Layout;
	/**
	 * An abstract base class for creating index-based layouts.
	 *
	 * #### Notes
	 * This class implements core functionality which is required by nearly
	 * all layouts. It is a good starting point for creating custom layouts
	 * which control the types of children that may be added to the layout.
	 *
	 * This class must be subclassed to make a fully functioning layout.
	 */
	var AbstractLayout = (function (_super) {
	    __extends(AbstractLayout, _super);
	    function AbstractLayout() {
	        _super.apply(this, arguments);
	    }
	    /**
	     * Get the index of the specified child widget.
	     *
	     * @param child - The child widget of interest.
	     *
	     * @returns The index of the specified child, or `-1`.
	     */
	    AbstractLayout.prototype.childIndex = function (child) {
	        for (var i = 0; i < this.childCount(); ++i) {
	            if (this.childAt(i) === child)
	                return i;
	        }
	        return -1;
	    };
	    /**
	     * A message handler invoked on a `'resize'` message.
	     *
	     * #### Notes
	     * The default implementation of this method sends an `UnknownSize`
	     * resize message to all children.
	     *
	     * This may be reimplemented by subclasses as needed.
	     */
	    AbstractLayout.prototype.onResize = function (msg) {
	        for (var i = 0; i < this.childCount(); ++i) {
	            phosphor_messaging_1.sendMessage(this.childAt(i), widget_1.ResizeMessage.UnknownSize);
	        }
	    };
	    /**
	     * A message handler invoked on an `'update-request'` message.
	     *
	     * #### Notes
	     * The default implementation of this method sends an `UnknownSize`
	     * resize message to all children.
	     *
	     * This may be reimplemented by subclasses as needed.
	     */
	    AbstractLayout.prototype.onUpdateRequest = function (msg) {
	        for (var i = 0; i < this.childCount(); ++i) {
	            phosphor_messaging_1.sendMessage(this.childAt(i), widget_1.ResizeMessage.UnknownSize);
	        }
	    };
	    /**
	     * A message handler invoked on an `'after-attach'` message.
	     *
	     * #### Notes
	     * The default implementation of this method forwards the message
	     * to all children.
	     *
	     * This may be reimplemented by subclasses as needed.
	     */
	    AbstractLayout.prototype.onAfterAttach = function (msg) {
	        for (var i = 0; i < this.childCount(); ++i) {
	            phosphor_messaging_1.sendMessage(this.childAt(i), msg);
	        }
	    };
	    /**
	     * A message handler invoked on a `'before-detach'` message.
	     *
	     * #### Notes
	     * The default implementation of this method forwards the message
	     * to all children.
	     *
	     * This may be reimplemented by subclasses as needed.
	     */
	    AbstractLayout.prototype.onBeforeDetach = function (msg) {
	        for (var i = 0; i < this.childCount(); ++i) {
	            phosphor_messaging_1.sendMessage(this.childAt(i), msg);
	        }
	    };
	    /**
	     * A message handler invoked on an `'after-show'` message.
	     *
	     * #### Notes
	     * The default implementation of this method forwards the message
	     * to all non-hidden children.
	     *
	     * This may be reimplemented by subclasses as needed.
	     */
	    AbstractLayout.prototype.onAfterShow = function (msg) {
	        for (var i = 0; i < this.childCount(); ++i) {
	            var child = this.childAt(i);
	            if (!child.isHidden)
	                phosphor_messaging_1.sendMessage(child, msg);
	        }
	    };
	    /**
	     * A message handler invoked on a `'before-hide'` message.
	     *
	     * #### Notes
	     * The default implementation of this method forwards the message
	     * to all non-hidden children.
	     *
	     * This may be reimplemented by subclasses as needed.
	     */
	    AbstractLayout.prototype.onBeforeHide = function (msg) {
	        for (var i = 0; i < this.childCount(); ++i) {
	            var child = this.childAt(i);
	            if (!child.isHidden)
	                phosphor_messaging_1.sendMessage(child, msg);
	        }
	    };
	    return AbstractLayout;
	})(Layout);
	exports.AbstractLayout = AbstractLayout;


/***/ },
/* 22 */
/***/ function(module, exports) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	/**
	 * An object used for type-safe inter-object communication.
	 *
	 * #### Notes
	 * Signals provide a type-safe implementation of the publish-subscribe
	 * pattern. An object (publisher) declares which signals it will emit,
	 * and consumers connect callbacks (subscribers) to those signals. The
	 * subscribers are invoked whenever the publisher emits the signal.
	 *
	 * A `Signal` object must be bound to a sender in order to be useful.
	 * A common pattern is to declare a `Signal` object as a static class
	 * member, along with a convenience getter which binds the signal to
	 * the `this` instance on-demand.
	 *
	 * #### Example
	 * ```typescript
	 * import { ISignal, Signal } from 'phosphor-signaling';
	 *
	 * class MyClass {
	 *
	 *   static valueChangedSignal = new Signal<MyClass, number>();
	 *
	 *   constructor(name: string) {
	 *     this._name = name;
	 *   }
	 *
	 *   get valueChanged(): ISignal<MyClass, number> {
	 *     return MyClass.valueChangedSignal.bind(this);
	 *   }
	 *
	 *   get name(): string {
	 *     return this._name;
	 *   }
	 *
	 *   get value(): number {
	 *     return this._value;
	 *   }
	 *
	 *   set value(value: number) {
	 *     if (value !== this._value) {
	 *       this._value = value;
	 *       this.valueChanged.emit(value);
	 *     }
	 *   }
	 *
	 *   private _name: string;
	 *   private _value = 0;
	 * }
	 *
	 * function logger(sender: MyClass, value: number): void {
	 *   console.log(sender.name, value);
	 * }
	 *
	 * let m1 = new MyClass('foo');
	 * let m2 = new MyClass('bar');
	 *
	 * m1.valueChanged.connect(logger);
	 * m2.valueChanged.connect(logger);
	 *
	 * m1.value = 42;  // logs: foo 42
	 * m2.value = 17;  // logs: bar 17
	 * ```
	 */
	var Signal = (function () {
	    function Signal() {
	    }
	    /**
	     * Bind the signal to a specific sender.
	     *
	     * @param sender - The sender object to bind to the signal.
	     *
	     * @returns The bound signal object which can be used for connecting,
	     *   disconnecting, and emitting the signal.
	     */
	    Signal.prototype.bind = function (sender) {
	        return new BoundSignal(this, sender);
	    };
	    return Signal;
	})();
	exports.Signal = Signal;
	/**
	 * Remove all connections where the given object is the sender.
	 *
	 * @param sender - The sender object of interest.
	 *
	 * #### Example
	 * ```typescript
	 * disconnectSender(someObject);
	 * ```
	 */
	function disconnectSender(sender) {
	    var list = senderMap.get(sender);
	    if (!list) {
	        return;
	    }
	    var conn = list.first;
	    while (conn !== null) {
	        removeFromSendersList(conn);
	        conn.callback = null;
	        conn.thisArg = null;
	        conn = conn.nextReceiver;
	    }
	    senderMap.delete(sender);
	}
	exports.disconnectSender = disconnectSender;
	/**
	 * Remove all connections where the given object is the receiver.
	 *
	 * @param receiver - The receiver object of interest.
	 *
	 * #### Notes
	 * If a `thisArg` is provided when connecting a signal, that object
	 * is considered the receiver. Otherwise, the `callback` is used as
	 * the receiver.
	 *
	 * #### Example
	 * ```typescript
	 * // disconnect a regular object receiver
	 * disconnectReceiver(myObject);
	 *
	 * // disconnect a plain callback receiver
	 * disconnectReceiver(myCallback);
	 * ```
	 */
	function disconnectReceiver(receiver) {
	    var conn = receiverMap.get(receiver);
	    if (!conn) {
	        return;
	    }
	    while (conn !== null) {
	        var next = conn.nextSender;
	        conn.callback = null;
	        conn.thisArg = null;
	        conn.prevSender = null;
	        conn.nextSender = null;
	        conn = next;
	    }
	    receiverMap.delete(receiver);
	}
	exports.disconnectReceiver = disconnectReceiver;
	/**
	 * Clear all signal data associated with the given object.
	 *
	 * @param obj - The object for which the signal data should be cleared.
	 *
	 * #### Notes
	 * This removes all signal connections where the object is used as
	 * either the sender or the receiver.
	 *
	 * #### Example
	 * ```typescript
	 * clearSignalData(someObject);
	 * ```
	 */
	function clearSignalData(obj) {
	    disconnectSender(obj);
	    disconnectReceiver(obj);
	}
	exports.clearSignalData = clearSignalData;
	/**
	 * A concrete implementation of ISignal.
	 */
	var BoundSignal = (function () {
	    /**
	     * Construct a new bound signal.
	     */
	    function BoundSignal(signal, sender) {
	        this._signal = signal;
	        this._sender = sender;
	    }
	    /**
	     * Connect a callback to the signal.
	     */
	    BoundSignal.prototype.connect = function (callback, thisArg) {
	        return connect(this._sender, this._signal, callback, thisArg);
	    };
	    /**
	     * Disconnect a callback from the signal.
	     */
	    BoundSignal.prototype.disconnect = function (callback, thisArg) {
	        return disconnect(this._sender, this._signal, callback, thisArg);
	    };
	    /**
	     * Emit the signal and invoke the connected callbacks.
	     */
	    BoundSignal.prototype.emit = function (args) {
	        emit(this._sender, this._signal, args);
	    };
	    return BoundSignal;
	})();
	/**
	 * A struct which holds connection data.
	 */
	var Connection = (function () {
	    function Connection() {
	        /**
	         * The signal for the connection.
	         */
	        this.signal = null;
	        /**
	         * The callback connected to the signal.
	         */
	        this.callback = null;
	        /**
	         * The `this` context for the callback.
	         */
	        this.thisArg = null;
	        /**
	         * The next connection in the singly linked receivers list.
	         */
	        this.nextReceiver = null;
	        /**
	         * The next connection in the doubly linked senders list.
	         */
	        this.nextSender = null;
	        /**
	         * The previous connection in the doubly linked senders list.
	         */
	        this.prevSender = null;
	    }
	    return Connection;
	})();
	/**
	 * The list of receiver connections for a specific sender.
	 */
	var ConnectionList = (function () {
	    function ConnectionList() {
	        /**
	         * The ref count for the list.
	         */
	        this.refs = 0;
	        /**
	         * The first connection in the list.
	         */
	        this.first = null;
	        /**
	         * The last connection in the list.
	         */
	        this.last = null;
	    }
	    return ConnectionList;
	})();
	/**
	 * A mapping of sender object to its receiver connection list.
	 */
	var senderMap = new WeakMap();
	/**
	 * A mapping of receiver object to its sender connection list.
	 */
	var receiverMap = new WeakMap();
	/**
	 * Create a connection between a sender, signal, and callback.
	 */
	function connect(sender, signal, callback, thisArg) {
	    // Coerce a `null` thisArg to `undefined`.
	    thisArg = thisArg || void 0;
	    // Search for an equivalent connection and bail if one exists.
	    var list = senderMap.get(sender);
	    if (list && findConnection(list, signal, callback, thisArg)) {
	        return false;
	    }
	    // Create a new connection.
	    var conn = new Connection();
	    conn.signal = signal;
	    conn.callback = callback;
	    conn.thisArg = thisArg;
	    // Add the connection to the receivers list.
	    if (!list) {
	        list = new ConnectionList();
	        list.first = conn;
	        list.last = conn;
	        senderMap.set(sender, list);
	    }
	    else if (list.last === null) {
	        list.first = conn;
	        list.last = conn;
	    }
	    else {
	        list.last.nextReceiver = conn;
	        list.last = conn;
	    }
	    // Add the connection to the senders list.
	    var receiver = thisArg || callback;
	    var head = receiverMap.get(receiver);
	    if (head) {
	        head.prevSender = conn;
	        conn.nextSender = head;
	    }
	    receiverMap.set(receiver, conn);
	    return true;
	}
	/**
	 * Break the connection between a sender, signal, and callback.
	 */
	function disconnect(sender, signal, callback, thisArg) {
	    // Coerce a `null` thisArg to `undefined`.
	    thisArg = thisArg || void 0;
	    // Search for an equivalent connection and bail if none exists.
	    var list = senderMap.get(sender);
	    if (!list) {
	        return false;
	    }
	    var conn = findConnection(list, signal, callback, thisArg);
	    if (!conn) {
	        return false;
	    }
	    // Remove the connection from the senders list. It will be removed
	    // from the receivers list the next time the signal is emitted.
	    removeFromSendersList(conn);
	    // Clear the connection data so it becomes a dead connection.
	    conn.callback = null;
	    conn.thisArg = null;
	    return true;
	}
	/**
	 * Emit a signal and invoke the connected callbacks.
	 */
	function emit(sender, signal, args) {
	    // If there is no connection list, there is nothing to do.
	    var list = senderMap.get(sender);
	    if (!list) {
	        return;
	    }
	    // Prepare to dispatch the callbacks. Increment the reference count
	    // on the list so that the list is cleaned only when the emit stack
	    // is fully unwound.
	    list.refs++;
	    var dirty = false;
	    var last = list.last;
	    var conn = list.first;
	    // Dispatch the callbacks. If a connection has a null callback, it
	    // indicates the list is dirty. Connections which match the signal
	    // are safely dispatched where all exceptions are logged. Dispatch
	    // is stopped at the last connection for the current stack frame.
	    while (conn !== null) {
	        if (!conn.callback) {
	            dirty = true;
	        }
	        else if (conn.signal === signal) {
	            safeInvoke(conn, sender, args);
	        }
	        if (conn === last) {
	            break;
	        }
	        conn = conn.nextReceiver;
	    }
	    // Decrement the reference count on the list.
	    list.refs--;
	    // Clean the list if it's dirty and the emit stack is fully unwound.
	    if (dirty && list.refs === 0) {
	        cleanList(list);
	    }
	}
	/**
	 * Safely invoke the callback for the given connection.
	 *
	 * Exceptions thrown by the callback will be caught and logged.
	 */
	function safeInvoke(conn, sender, args) {
	    try {
	        conn.callback.call(conn.thisArg, sender, args);
	    }
	    catch (err) {
	        console.error('Exception in signal handler:', err);
	    }
	}
	/**
	 * Find a matching connection in the given connection list.
	 *
	 * Returns `null` if no matching connection is found.
	 */
	function findConnection(list, signal, callback, thisArg) {
	    var conn = list.first;
	    while (conn !== null) {
	        if (conn.signal === signal &&
	            conn.callback === callback &&
	            conn.thisArg === thisArg) {
	            return conn;
	        }
	        conn = conn.nextReceiver;
	    }
	    return null;
	}
	/**
	 * Remove the dead connections from the given connection list.
	 */
	function cleanList(list) {
	    var prev;
	    var conn = list.first;
	    while (conn !== null) {
	        var next = conn.nextReceiver;
	        if (!conn.callback) {
	            conn.nextReceiver = null;
	        }
	        else if (!prev) {
	            list.first = conn;
	            prev = conn;
	        }
	        else {
	            prev.nextReceiver = conn;
	            prev = conn;
	        }
	        conn = next;
	    }
	    if (!prev) {
	        list.first = null;
	        list.last = null;
	    }
	    else {
	        prev.nextReceiver = null;
	        list.last = prev;
	    }
	}
	/**
	 * Remove a connection from the doubly linked list of senders.
	 */
	function removeFromSendersList(conn) {
	    var receiver = conn.thisArg || conn.callback;
	    if (!receiver) {
	        return;
	    }
	    var prev = conn.prevSender;
	    var next = conn.nextSender;
	    if (prev === null && next === null) {
	        receiverMap.delete(receiver);
	    }
	    else if (prev === null) {
	        receiverMap.set(receiver, next);
	        next.prevSender = null;
	    }
	    else if (next === null) {
	        prev.nextSender = null;
	    }
	    else {
	        prev.nextSender = next;
	        next.prevSender = prev;
	    }
	    conn.prevSender = null;
	    conn.nextSender = null;
	}
	//# sourceMappingURL=index.js.map

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var phosphor_messaging_1 = __webpack_require__(13);
	var phosphor_nodewrapper_1 = __webpack_require__(24);
	var phosphor_properties_1 = __webpack_require__(17);
	var phosphor_signaling_1 = __webpack_require__(22);
	var title_1 = __webpack_require__(25);
	/**
	 * The class name added to Widget instances.
	 */
	var WIDGET_CLASS = 'p-Widget';
	/**
	 * The class name added to hidden widgets.
	 */
	var HIDDEN_CLASS = 'p-mod-hidden';
	/**
	 * The base class of the Phosphor widget hierarchy.
	 *
	 * #### Notes
	 * This class will typically be subclassed in order to create a useful
	 * widget. However, it can be used directly to host externally created
	 * content. Simply instantiate an empty widget and add the DOM content
	 * directly to the widget's `.node`.
	 */
	var Widget = (function (_super) {
	    __extends(Widget, _super);
	    /**
	     * Construct a new widget.
	     */
	    function Widget() {
	        _super.call(this);
	        this._flags = 0;
	        this._layout = null;
	        this._parent = null;
	        this.addClass(WIDGET_CLASS);
	    }
	    /**
	     * Dispose of the widget and its descendants.
	     *
	     * #### Notes
	     * It is generally unsafe to use the widget after it is disposed.
	     *
	     * All calls made to this method after the first are a no-op.
	     */
	    Widget.prototype.dispose = function () {
	        // Do nothing if the widget is already disposed.
	        if (this.isDisposed) {
	            return;
	        }
	        // Set the disposed flag and emit the disposed signal.
	        this.setFlag(WidgetFlag.IsDisposed);
	        this.disposed.emit(void 0);
	        // Remove or detach the widget if necessary.
	        if (this.parent) {
	            this.parent = null;
	        }
	        else if (this.isAttached) {
	            this.detach();
	        }
	        // Dispose of the widget layout.
	        if (this._layout) {
	            this._layout.dispose();
	            this._layout = null;
	        }
	        // Clear the attached data associated with the widget.
	        phosphor_signaling_1.clearSignalData(this);
	        phosphor_messaging_1.clearMessageData(this);
	        phosphor_properties_1.clearPropertyData(this);
	    };
	    Object.defineProperty(Widget.prototype, "disposed", {
	        /**
	         * A signal emitted when the widget is disposed.
	         *
	         * **See also:** [[dispose]], [[disposed]]
	         */
	        get: function () {
	            return WidgetPrivate.disposedSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Widget.prototype, "isDisposed", {
	        /**
	         * Test whether the widget has been disposed.
	         *
	         * #### Notes
	         * This is a read-only property.
	         *
	         * **See also:** [[dispose]], [[disposed]]
	         */
	        get: function () {
	            return this.testFlag(WidgetFlag.IsDisposed);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Widget.prototype, "isAttached", {
	        /**
	         * Test whether the widget's node is attached to the DOM.
	         *
	         * #### Notes
	         * This is a read-only property.
	         *
	         * **See also:** [[attach]], [[detach]]
	         */
	        get: function () {
	            return this.testFlag(WidgetFlag.IsAttached);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Widget.prototype, "isHidden", {
	        /**
	         * Test whether the widget is explicitly hidden.
	         *
	         * #### Notes
	         * This is a read-only property.
	         *
	         * **See also:** [[isVisible]], [[hide]], [[show]]
	         */
	        get: function () {
	            return this.testFlag(WidgetFlag.IsHidden);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Widget.prototype, "isVisible", {
	        /**
	         * Test whether the widget is visible.
	         *
	         * #### Notes
	         * A widget is visible when it is attached to the DOM, is not
	         * explicitly hidden, and has no explicitly hidden ancestors.
	         *
	         * This is a read-only property.
	         *
	         * **See also:** [[isHidden]], [[hide]], [[show]]
	         */
	        get: function () {
	            return this.testFlag(WidgetFlag.IsVisible);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Widget.prototype, "title", {
	        /**
	         * Get the title data object for the widget.
	         *
	         * #### Notes
	         * The title data is used by some container widgets when displaying
	         * the widget along with a title, such as a tab panel or dock panel.
	         *
	         * Not all widgets will make use of the title data, so it is created
	         * on-demand the first time it is accessed.
	         */
	        get: function () {
	            return WidgetPrivate.titleProperty.get(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Widget.prototype, "parent", {
	        /**
	         * Get the parent of the widget.
	         *
	         * #### Notes
	         * This will be `null` if the widget does not have a parent.
	         */
	        get: function () {
	            return this._parent;
	        },
	        /**
	         * Set the parent of the widget.
	         *
	         * #### Notes
	         * The widget will be automatically removed from its current parent.
	         *
	         * This is a no-op if there is no effective parent change.
	         */
	        set: function (value) {
	            value = value || null;
	            if (this._parent === value) {
	                return;
	            }
	            if (value && this.contains(value)) {
	                throw new Error('Invalid parent widget.');
	            }
	            if (this._parent && !this._parent.isDisposed) {
	                phosphor_messaging_1.sendMessage(this._parent, new ChildMessage('child-removed', this));
	            }
	            this._parent = value;
	            if (this._parent && !this._parent.isDisposed) {
	                phosphor_messaging_1.sendMessage(this._parent, new ChildMessage('child-added', this));
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Widget.prototype, "layout", {
	        /**
	         * Get the layout for the widget.
	         *
	         * #### Notes
	         * This will be `null` if the widget does not have a layout.
	         */
	        get: function () {
	            return this._layout;
	        },
	        /**
	         * Set the layout for the widget.
	         *
	         * #### Notes
	         * The layout is single-use only. It cannot be set to `null` and it
	         * cannot be changed after the first assignment.
	         *
	         * The layout is disposed automatically when the widget is disposed.
	         */
	        set: function (value) {
	            if (!value) {
	                throw new Error('Cannot set widget layout to null.');
	            }
	            if (this._layout === value) {
	                return;
	            }
	            if (this._layout) {
	                throw new Error('Cannot change widget layout.');
	            }
	            if (value.parent) {
	                throw new Error('Cannot change layout parent.');
	            }
	            this._layout = value;
	            value.parent = this;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Test whether a widget is a descendant of this widget.
	     *
	     * @param widget - The widget of interest.
	     *
	     * @returns `true` if the widget is a descendant, `false` otherwise.
	     */
	    Widget.prototype.contains = function (widget) {
	        while (widget) {
	            if (widget === this) {
	                return true;
	            }
	            widget = widget._parent;
	        }
	        return false;
	    };
	    /**
	     * Post an `'update-request'` message to the widget.
	     *
	     * **See also:** [[MsgUpdateRequest]]
	     */
	    Widget.prototype.update = function () {
	        phosphor_messaging_1.postMessage(this, Widget.MsgUpdateRequest);
	    };
	    /**
	     * Post a `'fit-request'` message to the widget.
	     *
	     * **See also:** [[MsgFitRequest]]
	     */
	    Widget.prototype.fit = function () {
	        phosphor_messaging_1.postMessage(this, Widget.MsgFitRequest);
	    };
	    /**
	     * Send a `'close-request'` message to the widget.
	     *
	     * **See also:** [[MsgCloseRequest]]
	     */
	    Widget.prototype.close = function () {
	        phosphor_messaging_1.sendMessage(this, Widget.MsgCloseRequest);
	    };
	    /**
	     * Show the widget and make it visible to its parent widget.
	     *
	     * #### Notes
	     * This causes the [[isHidden]] property to be `false`.
	     */
	    Widget.prototype.show = function () {
	        if (!this.testFlag(WidgetFlag.IsHidden)) {
	            return;
	        }
	        this.clearFlag(WidgetFlag.IsHidden);
	        this.removeClass(HIDDEN_CLASS);
	        if (this.isAttached && (!this.parent || this.parent.isVisible)) {
	            phosphor_messaging_1.sendMessage(this, Widget.MsgAfterShow);
	        }
	        if (this.parent) {
	            phosphor_messaging_1.sendMessage(this.parent, new ChildMessage('child-shown', this));
	        }
	    };
	    /**
	     * Hide the widget and make it hidden to its parent widget.
	     *
	     * #### Notes
	     * This causes the [[isHidden]] property to be `true`.
	     */
	    Widget.prototype.hide = function () {
	        if (this.testFlag(WidgetFlag.IsHidden)) {
	            return;
	        }
	        this.setFlag(WidgetFlag.IsHidden);
	        if (this.isAttached && (!this.parent || this.parent.isVisible)) {
	            phosphor_messaging_1.sendMessage(this, Widget.MsgBeforeHide);
	        }
	        this.addClass(HIDDEN_CLASS);
	        if (this.parent) {
	            phosphor_messaging_1.sendMessage(this.parent, new ChildMessage('child-hidden', this));
	        }
	    };
	    /**
	     * Set whether the widget is hidden.
	     *
	     * @param hidden - `true` to hide the widget, or `false` to show it.
	     *
	     * #### Notes
	     * `widget.setHidden(true)` is equivalent to `widget.hide()`, and
	     * `widget.setHidden(false)` is equivalent to `widget.show()`.
	     */
	    Widget.prototype.setHidden = function (hidden) {
	        if (hidden) {
	            this.hide();
	        }
	        else {
	            this.show();
	        }
	    };
	    /**
	     * Attach the widget to a host DOM node.
	     *
	     * @param host - The DOM node to use as the widget's host.
	     *
	     * @throws An error if the widget is not a root widget, if the widget
	     *   is already attached, or if the host is not attached to the DOM.
	     */
	    Widget.prototype.attach = function (host) {
	        if (this.parent) {
	            throw new Error('Cannot attach child widget.');
	        }
	        if (this.isAttached || document.body.contains(this.node)) {
	            throw new Error('Widget already attached.');
	        }
	        if (!document.body.contains(host)) {
	            throw new Error('Host not attached.');
	        }
	        host.appendChild(this.node);
	        phosphor_messaging_1.sendMessage(this, Widget.MsgAfterAttach);
	    };
	    /**
	     * Detach the widget from its host DOM node.
	     *
	     * @throws An error if the widget is not a root widget, or if the
	     *   widget is not attached.
	     */
	    Widget.prototype.detach = function () {
	        if (this.parent) {
	            throw new Error('Cannot detach child widget.');
	        }
	        if (!this.isAttached || !document.body.contains(this.node)) {
	            throw new Error('Widget not attached.');
	        }
	        phosphor_messaging_1.sendMessage(this, Widget.MsgBeforeDetach);
	        this.node.parentNode.removeChild(this.node);
	    };
	    /**
	     * Test whether the given widget flag is set.
	     *
	     * #### Notes
	     * This will not typically be consumed directly by user code.
	     */
	    Widget.prototype.testFlag = function (flag) {
	        return (this._flags & flag) !== 0;
	    };
	    /**
	     * Set the given widget flag.
	     *
	     * #### Notes
	     * This will not typically be consumed directly by user code.
	     */
	    Widget.prototype.setFlag = function (flag) {
	        this._flags |= flag;
	    };
	    /**
	     * Clear the given widget flag.
	     *
	     * #### Notes
	     * This will not typically be consumed directly by user code.
	     */
	    Widget.prototype.clearFlag = function (flag) {
	        this._flags &= ~flag;
	    };
	    /**
	     * Compress a message posted to the widget.
	     *
	     * @param msg - The message posted to the widget.
	     *
	     * @param pending - The queue of pending messages for the widget.
	     *
	     * @returns `true` if the message should be ignored, or `false` if
	     *   the message should be enqueued for delivery as normal.
	     *
	     * #### Notes
	     * Subclasses may reimplement this method as needed.
	     */
	    Widget.prototype.compressMessage = function (msg, pending) {
	        if (msg.type === 'update-request') {
	            return pending.some(function (other) { return other.type === 'update-request'; });
	        }
	        if (msg.type === 'fit-request') {
	            return pending.some(function (other) { return other.type === 'fit-request'; });
	        }
	        return false;
	    };
	    /**
	     * Process a message sent to the widget.
	     *
	     * @param msg - The message sent to the widget.
	     *
	     * #### Notes
	     * Subclasses may reimplement this method as needed.
	     */
	    Widget.prototype.processMessage = function (msg) {
	        switch (msg.type) {
	            case 'resize':
	                this.notifyLayout(msg);
	                this.onResize(msg);
	                break;
	            case 'update-request':
	                this.notifyLayout(msg);
	                this.onUpdateRequest(msg);
	                break;
	            case 'after-show':
	                this.setFlag(WidgetFlag.IsVisible);
	                this.notifyLayout(msg);
	                this.onAfterShow(msg);
	                break;
	            case 'before-hide':
	                this.notifyLayout(msg);
	                this.onBeforeHide(msg);
	                this.clearFlag(WidgetFlag.IsVisible);
	                break;
	            case 'after-attach':
	                var visible = !this.isHidden && (!this.parent || this.parent.isVisible);
	                if (visible)
	                    this.setFlag(WidgetFlag.IsVisible);
	                this.setFlag(WidgetFlag.IsAttached);
	                this.notifyLayout(msg);
	                this.onAfterAttach(msg);
	                break;
	            case 'before-detach':
	                this.notifyLayout(msg);
	                this.onBeforeDetach(msg);
	                this.clearFlag(WidgetFlag.IsVisible);
	                this.clearFlag(WidgetFlag.IsAttached);
	                break;
	            case 'close-request':
	                this.notifyLayout(msg);
	                this.onCloseRequest(msg);
	                break;
	            case 'child-added':
	                this.notifyLayout(msg);
	                this.onChildAdded(msg);
	                break;
	            case 'child-removed':
	                this.notifyLayout(msg);
	                this.onChildRemoved(msg);
	                break;
	            default:
	                this.notifyLayout(msg);
	                break;
	        }
	    };
	    /**
	     * Invoke the message processing routine of the widget's layout.
	     *
	     * @param msg - The message to dispatch to the layout.
	     *
	     * #### Notes
	     * This is a no-op if the widget does not have a layout.
	     */
	    Widget.prototype.notifyLayout = function (msg) {
	        if (this.layout)
	            this.layout.processParentMessage(msg);
	    };
	    /**
	     * A message handler invoked on a `'close-request'` message.
	     *
	     * #### Notes
	     * The default implementation of this handler detaches the widget.
	     *
	     * **See also:** [[close]], [[MsgCloseRequest]]
	     */
	    Widget.prototype.onCloseRequest = function (msg) {
	        if (this.parent) {
	            this.parent = null;
	        }
	        else if (this.isAttached) {
	            this.detach();
	        }
	    };
	    /**
	     * A message handler invoked on a `'resize'` message.
	     *
	     * The default implementation of this handler is a no-op.
	     *
	     * **See also:** [[ResizeMessage]]
	     */
	    Widget.prototype.onResize = function (msg) { };
	    /**
	     * A message handler invoked on an `'update-request'` message.
	     *
	     * The default implementation of this handler is a no-op.
	     *
	     * **See also:** [[update]], [[MsgUpdateRequest]]
	     */
	    Widget.prototype.onUpdateRequest = function (msg) { };
	    /**
	     * A message handler invoked on an `'after-show'` message.
	     *
	     * The default implementation of this handler is a no-op.
	     *
	     * **See also:** [[MsgAfterShow]]
	     */
	    Widget.prototype.onAfterShow = function (msg) { };
	    /**
	     * A message handler invoked on a `'before-hide'` message.
	     *
	     * The default implementation of this handler is a no-op.
	     *
	     * **See also:** [[MsgBeforeHide]]
	     */
	    Widget.prototype.onBeforeHide = function (msg) { };
	    /**
	     * A message handler invoked on an `'after-attach'` message.
	     *
	     * The default implementation of this handler is a no-op.
	     *
	     * **See also:** [[MsgAfterAttach]]
	     */
	    Widget.prototype.onAfterAttach = function (msg) { };
	    /**
	     * A message handler invoked on a `'before-detach'` message.
	     *
	     * The default implementation of this handler is a no-op.
	     *
	     * **See also:** [[MsgBeforeDetach]]
	     */
	    Widget.prototype.onBeforeDetach = function (msg) { };
	    /**
	     * A message handler invoked on a `'child-added'` message.
	     *
	     * The default implementation of this handler is a no-op.
	     *
	     * **See also:** [[ChildMessage]]
	     */
	    Widget.prototype.onChildAdded = function (msg) { };
	    /**
	     * A message handler invoked on a `'child-removed'` message.
	     *
	     * The default implementation of this handler is a no-op.
	     *
	     * **See also:** [[ChildMessage]]
	     */
	    Widget.prototype.onChildRemoved = function (msg) { };
	    return Widget;
	})(phosphor_nodewrapper_1.NodeWrapper);
	exports.Widget = Widget;
	/**
	 * The namespace for the `Widget` class statics.
	 */
	var Widget;
	(function (Widget) {
	    /**
	     * A singleton `'update-request'` message.
	     *
	     * #### Notes
	     * This message can be dispatched to supporting widgets in order to
	     * update their content based on the current widget state. Not all
	     * widgets will respond to messages of this type.
	     *
	     * For widgets with a layout, this message will inform the layout to
	     * update the position and size of its child widgets.
	     *
	     * Messages of this type are compressed by default.
	     *
	     * **See also:** [[update]], [[onUpdateRequest]]
	     */
	    Widget.MsgUpdateRequest = new phosphor_messaging_1.Message('update-request');
	    /**
	     * A singleton `'fit-request'` message.
	     *
	     * #### Notes
	     * For widgets with a layout, this message will inform the layout to
	     * recalculate its size constraints to fit the space requirements of
	     * its child widgets, and to update their position and size. Not all
	     * layouts will respond to messages of this type.
	     *
	     * Messages of this type are compressed by default.
	     *
	     * **See also:** [[fit]]
	     */
	    Widget.MsgFitRequest = new phosphor_messaging_1.Message('fit-request');
	    /**
	     * A singleton `'close-request'` message.
	     *
	     * #### Notes
	     * This message should be dispatched to a widget when it should close
	     * and remove itself from the widget hierarchy.
	     *
	     * Messages of this type are compressed by default.
	     *
	     * **See also:** [[close]], [[onCloseRequest]]
	     */
	    Widget.MsgCloseRequest = new phosphor_messaging_1.Message('close-request');
	    /**
	     * A singleton `'after-show'` message.
	     *
	     * #### Notes
	     * This message is sent to a widget after it becomes visible.
	     *
	     * This message is **not** sent when the widget is being attached.
	     *
	     * **See also:** [[isVisible]], [[onAfterShow]]
	     */
	    Widget.MsgAfterShow = new phosphor_messaging_1.Message('after-show');
	    /**
	     * A singleton `'before-hide'` message.
	     *
	     * #### Notes
	     * This message is sent to a widget before it becomes not-visible.
	     *
	     * This message is **not** sent when the widget is being detached.
	     *
	     * **See also:** [[isVisible]], [[onBeforeHide]]
	     */
	    Widget.MsgBeforeHide = new phosphor_messaging_1.Message('before-hide');
	    /**
	     * A singleton `'after-attach'` message.
	     *
	     * #### Notes
	     * This message is sent to a widget after it is attached.
	     *
	     * **See also:** [[isAttached]], [[onAfterAttach]]
	     */
	    Widget.MsgAfterAttach = new phosphor_messaging_1.Message('after-attach');
	    /**
	     * A singleton `'before-detach'` message.
	     *
	     * #### Notes
	     * This message is sent to a widget before it is detached.
	     *
	     * **See also:** [[isAttached]], [[onBeforeDetach]]
	     */
	    Widget.MsgBeforeDetach = new phosphor_messaging_1.Message('before-detach');
	})(Widget = exports.Widget || (exports.Widget = {}));
	/**
	 * An enum of widget bit flags.
	 */
	(function (WidgetFlag) {
	    /**
	     * The widget has been disposed.
	     */
	    WidgetFlag[WidgetFlag["IsDisposed"] = 1] = "IsDisposed";
	    /**
	     * The widget is attached to the DOM.
	     */
	    WidgetFlag[WidgetFlag["IsAttached"] = 2] = "IsAttached";
	    /**
	     * The widget is hidden.
	     */
	    WidgetFlag[WidgetFlag["IsHidden"] = 4] = "IsHidden";
	    /**
	     * The widget is visible.
	     */
	    WidgetFlag[WidgetFlag["IsVisible"] = 8] = "IsVisible";
	})(exports.WidgetFlag || (exports.WidgetFlag = {}));
	var WidgetFlag = exports.WidgetFlag;
	/**
	 * A message class for child related messages.
	 */
	var ChildMessage = (function (_super) {
	    __extends(ChildMessage, _super);
	    /**
	     * Construct a new child message.
	     *
	     * @param type - The message type.
	     *
	     * @param child - The child widget for the message.
	     */
	    function ChildMessage(type, child) {
	        _super.call(this, type);
	        this._child = child;
	    }
	    Object.defineProperty(ChildMessage.prototype, "child", {
	        /**
	         * The child widget for the message.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._child;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return ChildMessage;
	})(phosphor_messaging_1.Message);
	exports.ChildMessage = ChildMessage;
	/**
	 * A message class for `'resize'` messages.
	 */
	var ResizeMessage = (function (_super) {
	    __extends(ResizeMessage, _super);
	    /**
	     * Construct a new resize message.
	     *
	     * @param width - The **offset width** of the widget, or `-1` if
	     *   the width is not known.
	     *
	     * @param height - The **offset height** of the widget, or `-1` if
	     *   the height is not known.
	     */
	    function ResizeMessage(width, height) {
	        _super.call(this, 'resize');
	        this._width = width;
	        this._height = height;
	    }
	    Object.defineProperty(ResizeMessage.prototype, "width", {
	        /**
	         * The offset width of the widget.
	         *
	         * #### Notes
	         * This will be `-1` if the width is unknown.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._width;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ResizeMessage.prototype, "height", {
	        /**
	         * The offset height of the widget.
	         *
	         * #### Notes
	         * This will be `-1` if the height is unknown.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._height;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return ResizeMessage;
	})(phosphor_messaging_1.Message);
	exports.ResizeMessage = ResizeMessage;
	/**
	 * The namespace for the `ResizeMessage` class statics.
	 */
	var ResizeMessage;
	(function (ResizeMessage) {
	    /**
	     * A singleton `'resize'` message with an unknown size.
	     */
	    ResizeMessage.UnknownSize = new ResizeMessage(-1, -1);
	})(ResizeMessage = exports.ResizeMessage || (exports.ResizeMessage = {}));
	/**
	 * The namespace for the widget private data.
	 */
	var WidgetPrivate;
	(function (WidgetPrivate) {
	    /**
	     * A signal emitted when the widget is disposed.
	     */
	    WidgetPrivate.disposedSignal = new phosphor_signaling_1.Signal();
	    /**
	     * A property for the title data for a widget.
	     */
	    WidgetPrivate.titleProperty = new phosphor_properties_1.Property({
	        name: 'title',
	        create: function () { return new title_1.Title(); },
	    });
	})(WidgetPrivate || (WidgetPrivate = {}));


/***/ },
/* 24 */
/***/ function(module, exports) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	/**
	 * A base class for creating objects which wrap a DOM node.
	 */
	var NodeWrapper = (function () {
	    /**
	     * Construct a new node wrapper.
	     */
	    function NodeWrapper() {
	        this._node = this.constructor.createNode();
	    }
	    /**
	     * Create the DOM node for a new node wrapper instance.
	     *
	     * @returns The DOM node to use with the node wrapper instance.
	     *
	     * #### Notes
	     * The default implementation creates an empty `<div>`.
	     *
	     * This may be reimplemented by a subclass to create a custom node.
	     */
	    NodeWrapper.createNode = function () {
	        return document.createElement('div');
	    };
	    Object.defineProperty(NodeWrapper.prototype, "node", {
	        /**
	         * Get the DOM node managed by the wrapper.
	         *
	         * #### Notes
	         * This property is read-only.
	         */
	        get: function () {
	            return this._node;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(NodeWrapper.prototype, "id", {
	        /**
	         * Get the id of the wrapper's DOM node.
	         */
	        get: function () {
	            return this._node.id;
	        },
	        /**
	         * Set the id of the wrapper's DOM node.
	         */
	        set: function (value) {
	            this._node.id = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Test whether the wrapper's DOM node has the given class name.
	     *
	     * @param name - The class name of interest.
	     *
	     * @returns `true` if the node has the class, `false` otherwise.
	     */
	    NodeWrapper.prototype.hasClass = function (name) {
	        return this._node.classList.contains(name);
	    };
	    /**
	     * Add a class name to the wrapper's DOM node.
	     *
	     * @param name - The class name to add to the node.
	     *
	     * #### Notes
	     * If the class name is already added to the node, this is a no-op.
	     */
	    NodeWrapper.prototype.addClass = function (name) {
	        this._node.classList.add(name);
	    };
	    /**
	     * Remove a class name from the wrapper's DOM node.
	     *
	     * @param name - The class name to remove from the node.
	     *
	     * #### Notes
	     * If the class name is not yet added to the node, this is a no-op.
	     */
	    NodeWrapper.prototype.removeClass = function (name) {
	        this._node.classList.remove(name);
	    };
	    /**
	     * Toggle a class name on the wrapper's DOM node.
	     *
	     * @param name - The class name to toggle on the node.
	     *
	     * @param force - Whether to force add the class (`true`) or force
	     *   remove the class (`false`). If not provided, the presence of
	     *   the class will be toggled from its current state.
	     *
	     * @returns `true` if the class is now present, `false` otherwise.
	     */
	    NodeWrapper.prototype.toggleClass = function (name, force) {
	        var present;
	        if (force === true) {
	            this.addClass(name);
	            present = true;
	        }
	        else if (force === false) {
	            this.removeClass(name);
	            present = false;
	        }
	        else if (this.hasClass(name)) {
	            this.removeClass(name);
	            present = false;
	        }
	        else {
	            this.addClass(name);
	            present = true;
	        }
	        return present;
	    };
	    return NodeWrapper;
	})();
	exports.NodeWrapper = NodeWrapper;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var phosphor_properties_1 = __webpack_require__(17);
	var phosphor_signaling_1 = __webpack_require__(22);
	/**
	 * An object which holds data related to a widget title.
	 *
	 * #### Notes
	 * A title object is intended to hold the data necessary to display a
	 * header for a particular widget. A common example is the `TabPanel`,
	 * which uses the widget title to populate the tab for a child widget.
	 */
	var Title = (function () {
	    /**
	     * Construct a new title.
	     *
	     * @param options - The options for initializing a title.
	     */
	    function Title(options) {
	        if (options)
	            TitlePrivate.initFrom(this, options);
	    }
	    Object.defineProperty(Title.prototype, "changed", {
	        /**
	         * A signal emitted when the title state changes.
	         */
	        get: function () {
	            return TitlePrivate.changedSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Title.prototype, "text", {
	        /**
	         * Get the text for the title.
	         *
	         * #### Notes
	         * The default value is an empty string.
	         */
	        get: function () {
	            return TitlePrivate.textProperty.get(this);
	        },
	        /**
	         * Set the text for the title.
	         */
	        set: function (value) {
	            TitlePrivate.textProperty.set(this, value);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Title.prototype, "icon", {
	        /**
	         * Get the icon class name for the title.
	         *
	         * #### Notes
	         * The default value is an empty string.
	         */
	        get: function () {
	            return TitlePrivate.iconProperty.get(this);
	        },
	        /**
	         * Set the icon class name for the title.
	         *
	         * #### Notes
	         * Multiple class names can be separated with whitespace.
	         */
	        set: function (value) {
	            TitlePrivate.iconProperty.set(this, value);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Title.prototype, "closable", {
	        /**
	         * Get the closable state for the title.
	         *
	         * #### Notes
	         * The default value is `false`.
	         */
	        get: function () {
	            return TitlePrivate.closableProperty.get(this);
	        },
	        /**
	         * Set the closable state for the title.
	         *
	         * #### Notes
	         * This controls the presence of a close icon when applicable.
	         */
	        set: function (value) {
	            TitlePrivate.closableProperty.set(this, value);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Title.prototype, "className", {
	        /**
	         * Get the extra class name for the title.
	         *
	         * #### Notes
	         * The default value is an empty string.
	         */
	        get: function () {
	            return TitlePrivate.classNameProperty.get(this);
	        },
	        /**
	         * Set the extra class name for the title.
	         *
	         * #### Notes
	         * Multiple class names can be separated with whitespace.
	         */
	        set: function (value) {
	            TitlePrivate.classNameProperty.set(this, value);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Title;
	})();
	exports.Title = Title;
	/**
	 * The namespace for the title private data.
	 */
	var TitlePrivate;
	(function (TitlePrivate) {
	    /**
	     * A signal emitted when the title state changes.
	     */
	    TitlePrivate.changedSignal = new phosphor_signaling_1.Signal();
	    /**
	     * The property descriptor for the title text.
	     */
	    TitlePrivate.textProperty = new phosphor_properties_1.Property({
	        name: 'text',
	        value: '',
	        notify: TitlePrivate.changedSignal,
	    });
	    /**
	     * The property descriptor for the title icon class.
	     */
	    TitlePrivate.iconProperty = new phosphor_properties_1.Property({
	        name: 'icon',
	        value: '',
	        notify: TitlePrivate.changedSignal,
	    });
	    /**
	     * The property descriptor for the title closable state.
	     */
	    TitlePrivate.closableProperty = new phosphor_properties_1.Property({
	        name: 'closable',
	        value: false,
	        notify: TitlePrivate.changedSignal,
	    });
	    /**
	     * The property descriptor for the title extra class name.
	     */
	    TitlePrivate.classNameProperty = new phosphor_properties_1.Property({
	        name: 'className',
	        value: '',
	        notify: TitlePrivate.changedSignal,
	    });
	    /**
	     * Initialize a title from an options object.
	     */
	    function initFrom(title, options) {
	        if (options.text !== void 0) {
	            title.text = options.text;
	        }
	        if (options.icon !== void 0) {
	            title.icon = options.icon;
	        }
	        if (options.closable !== void 0) {
	            title.closable = options.closable;
	        }
	        if (options.className !== void 0) {
	            title.className = options.className;
	        }
	    }
	    TitlePrivate.initFrom = initFrom;
	})(TitlePrivate || (TitlePrivate = {}));


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(27);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./index.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./index.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, "/*-----------------------------------------------------------------------------\r\n| Copyright (c) 2014-2015, PhosphorJS Contributors\r\n|\r\n| Distributed under the terms of the BSD 3-Clause License.\r\n|\r\n| The full license is in the file LICENSE, distributed with this software.\r\n|----------------------------------------------------------------------------*/\r\n.p-Widget {\r\n  box-sizing: border-box;\r\n  position: relative;\r\n  overflow: hidden;\r\n  cursor: default;\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n}\r\n\r\n\r\n.p-Widget.p-mod-hidden {\r\n  display: none;\r\n}\r\n", ""]);

	// exports


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var phosphor_widget_1 = __webpack_require__(20);
	var layout_1 = __webpack_require__(19);
	/**
	 * The class name added to Panel instances.
	 */
	var PANEL_CLASS = 'p-Panel';
	/**
	 * A simple and convenient panel widget class.
	 *
	 * #### Notes
	 * This class is suitable as a base class for implementing a variety of
	 * convenience panels, but can also be used directly along with CSS to
	 * arrange a collection of widgets.
	 *
	 * This class provides a convenience wrapper around a [[PanelLayout]].
	 */
	var Panel = (function (_super) {
	    __extends(Panel, _super);
	    /**
	     * Construct a new panel.
	     */
	    function Panel() {
	        _super.call(this);
	        this.addClass(PANEL_CLASS);
	        this.layout = this.constructor.createLayout();
	    }
	    /**
	     * Create a panel layout to use with a panel.
	     *
	     * @returns A new panel layout to use with a panel.
	     *
	     * #### Notes
	     * This may be reimplemented by a subclass to create custom layouts.
	     */
	    Panel.createLayout = function () {
	        return new layout_1.PanelLayout();
	    };
	    /**
	     * Get the number of child widgets in the panel.
	     *
	     * @returns The number of child widgets in the panel.
	     */
	    Panel.prototype.childCount = function () {
	        return this.layout.childCount();
	    };
	    /**
	     * Get the child widget at the specified index.
	     *
	     * @param index - The index of the child widget of interest.
	     *
	     * @returns The child at the specified index, or `undefined`.
	     */
	    Panel.prototype.childAt = function (index) {
	        return this.layout.childAt(index);
	    };
	    /**
	     * Get the index of the specified child widget.
	     *
	     * @param child - The child widget of interest.
	     *
	     * @returns The index of the specified child, or `-1`.
	     */
	    Panel.prototype.childIndex = function (child) {
	        return this.layout.childIndex(child);
	    };
	    /**
	     * Add a child widget to the end of the panel.
	     *
	     * @param child - The child widget to add to the panel.
	     *
	     * #### Notes
	     * If the child is already contained in the panel, it will be moved.
	     */
	    Panel.prototype.addChild = function (child) {
	        this.layout.addChild(child);
	    };
	    /**
	     * Insert a child widget at the specified index.
	     *
	     * @param index - The index at which to insert the child.
	     *
	     * @param child - The child widget to insert into to the panel.
	     *
	     * #### Notes
	     * If the child is already contained in the panel, it will be moved.
	     */
	    Panel.prototype.insertChild = function (index, child) {
	        this.layout.insertChild(index, child);
	    };
	    return Panel;
	})(phosphor_widget_1.Widget);
	exports.Panel = Panel;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var phosphor_panel_1 = __webpack_require__(18);
	var layout_1 = __webpack_require__(5);
	/**
	 * The class name added to BoxPanel instances.
	 */
	var BOX_PANEL_CLASS = 'p-BoxPanel';
	/**
	 * The class name added to a BoxPanel child.
	 */
	var CHILD_CLASS = 'p-BoxPanel-child';
	/**
	 * A panel which arranges its children in a single row or column.
	 *
	 * #### Notes
	 * This class provides a convenience wrapper around a [[BoxLayout]].
	 */
	var BoxPanel = (function (_super) {
	    __extends(BoxPanel, _super);
	    /**
	     * Construct a new box panel.
	     */
	    function BoxPanel() {
	        _super.call(this);
	        this.addClass(BOX_PANEL_CLASS);
	    }
	    /**
	     * Create a box layout for a box panel.
	     */
	    BoxPanel.createLayout = function () {
	        return new layout_1.BoxLayout();
	    };
	    Object.defineProperty(BoxPanel.prototype, "direction", {
	        /**
	         * Get the layout direction for the box panel.
	         */
	        get: function () {
	            return this.layout.direction;
	        },
	        /**
	         * Set the layout direction for the box panel.
	         */
	        set: function (value) {
	            this.layout.direction = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(BoxPanel.prototype, "spacing", {
	        /**
	         * Get the inter-element spacing for the box panel.
	         */
	        get: function () {
	            return this.layout.spacing;
	        },
	        /**
	         * Set the inter-element spacing for the box panel.
	         */
	        set: function (value) {
	            this.layout.spacing = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * A message handler invoked on a `'child-added'` message.
	     */
	    BoxPanel.prototype.onChildAdded = function (msg) {
	        msg.child.addClass(CHILD_CLASS);
	    };
	    /**
	     * A message handler invoked on a `'child-removed'` message.
	     */
	    BoxPanel.prototype.onChildRemoved = function (msg) {
	        msg.child.removeClass(CHILD_CLASS);
	    };
	    return BoxPanel;
	})(phosphor_panel_1.Panel);
	exports.BoxPanel = BoxPanel;
	/**
	 * The namespace for the `BoxPanel` class statics.
	 */
	var BoxPanel;
	(function (BoxPanel) {
	    /**
	     * A convenience alias of the `LeftToRight` [[Direction]].
	     */
	    BoxPanel.LeftToRight = layout_1.Direction.LeftToRight;
	    /**
	     * A convenience alias of the `RightToLeft` [[Direction]].
	     */
	    BoxPanel.RightToLeft = layout_1.Direction.RightToLeft;
	    /**
	     * A convenience alias of the `TopToBottom` [[Direction]].
	     */
	    BoxPanel.TopToBottom = layout_1.Direction.TopToBottom;
	    /**
	     * A convenience alias of the `BottomToTop` [[Direction]].
	     */
	    BoxPanel.BottomToTop = layout_1.Direction.BottomToTop;
	    /**
	     * Get the box panel stretch factor for the given widget.
	     *
	     * @param widget - The widget of interest.
	     *
	     * @returns The box panel stretch factor for the widget.
	     */
	    function getStretch(widget) {
	        return layout_1.BoxLayout.getStretch(widget);
	    }
	    BoxPanel.getStretch = getStretch;
	    /**
	     * Set the box panel stretch factor for the given widget.
	     *
	     * @param widget - The widget of interest.
	     *
	     * @param value - The value for the stretch factor.
	     */
	    function setStretch(widget, value) {
	        layout_1.BoxLayout.setStretch(widget, value);
	    }
	    BoxPanel.setStretch = setStretch;
	    /**
	     * Get the box panel size basis for the given widget.
	     *
	     * @param widget - The widget of interest.
	     *
	     * @returns The box panel size basis for the widget.
	     */
	    function getSizeBasis(widget) {
	        return layout_1.BoxLayout.getSizeBasis(widget);
	    }
	    BoxPanel.getSizeBasis = getSizeBasis;
	    /**
	     * Set the box panel size basis for the given widget.
	     *
	     * @param widget - The widget of interest.
	     *
	     * @param value - The value for the size basis.
	     */
	    function setSizeBasis(widget, value) {
	        layout_1.BoxLayout.setSizeBasis(widget, value);
	    }
	    BoxPanel.setSizeBasis = setSizeBasis;
	})(BoxPanel = exports.BoxPanel || (exports.BoxPanel = {}));


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var arrays = __webpack_require__(3);
	var phosphor_domutil_1 = __webpack_require__(7);
	var phosphor_dragdrop_1 = __webpack_require__(31);
	var phosphor_nodewrapper_1 = __webpack_require__(24);
	var phosphor_properties_1 = __webpack_require__(17);
	var phosphor_splitpanel_1 = __webpack_require__(32);
	var phosphor_stackedpanel_1 = __webpack_require__(37);
	var phosphor_tabs_1 = __webpack_require__(40);
	var phosphor_widget_1 = __webpack_require__(20);
	__webpack_require__(45);
	// TODO - need better solution for storing these class names
	/**
	 * The class name added to DockPanel instances.
	 */
	var DOCK_PANEL_CLASS = 'p-DockPanel';
	/**
	 * The class name added to dock tab panels.
	 */
	var TAB_PANEL_CLASS = 'p-DockTabPanel';
	/**
	 * The class name added to dock split panels.
	 */
	var SPLIT_PANEL_CLASS = 'p-DockSplitPanel';
	/**
	 * The class name added to dock panel overlays.
	 */
	var OVERLAY_CLASS = 'p-DockPanel-overlay';
	/**
	 * The class name added to hidden overlays and tabs.
	 */
	var HIDDEN_CLASS = 'p-mod-hidden';
	/**
	 * The class name added to top root dock overlays.
	 */
	var ROOT_TOP_CLASS = 'p-mod-root-top';
	/**
	 * The class name added to left root dock overlays.
	 */
	var ROOT_LEFT_CLASS = 'p-mod-root-left';
	/**
	 * The class name added to right root dock overlays.
	 */
	var ROOT_RIGHT_CLASS = 'p-mod-root-right';
	/**
	 * The class name added to bottom root dock overlays.
	 */
	var ROOT_BOTTOM_CLASS = 'p-mod-root-bottom';
	/**
	 * The class name added to center root dock overlays.
	 */
	var ROOT_CENTER_CLASS = 'p-mod-root-center';
	/**
	 * The class name added to top panel dock overlays.
	 */
	var PANEL_TOP_CLASS = 'p-mod-panel-top';
	/**
	 * The class name added to left panel dock overlays.
	 */
	var PANEL_LEFT_CLASS = 'p-mod-panel-left';
	/**
	 * The class name added to right panel dock overlays.
	 */
	var PANEL_RIGHT_CLASS = 'p-mod-panel-right';
	/**
	 * The class name added to bottom panel dock overlays.
	 */
	var PANEL_BOTTOM_CLASS = 'p-mod-panel-bottom';
	/**
	 * The class named added to center panel dock overlays.
	 */
	var PANEL_CENTER_CLASS = 'p-mod-panel-center';
	/**
	 * The factory MIME type supported by the dock panel.
	 */
	var FACTORY_MIME = 'application/x-phosphor-widget-factory';
	/**
	 * The size of the edge dock zone for the root panel.
	 */
	var EDGE_SIZE = 30;
	/**
	 * A widget which provides a flexible docking area for content widgets.
	 */
	var DockPanel = (function (_super) {
	    __extends(DockPanel, _super);
	    /**
	     * Construct a new dock panel.
	     */
	    function DockPanel() {
	        _super.call(this);
	        this.addClass(DOCK_PANEL_CLASS);
	        this.layout = new phosphor_stackedpanel_1.StackedLayout();
	    }
	    Object.defineProperty(DockPanel.prototype, "spacing", {
	        /**
	         * Get the spacing between the tab panels.
	         */
	        get: function () {
	            return DockPanelPrivate.spacingProperty.get(this);
	        },
	        /**
	         * Set the spacing between the tab panels.
	         */
	        set: function (value) {
	            DockPanelPrivate.spacingProperty.set(this, value);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Insert a widget as a new panel above a reference widget.
	     *
	     * @param widget - The widget to insert into the dock panel.
	     *
	     * @param ref - The reference widget. If this is not provided, the
	     *   widget will be inserted at the top edge of the dock panel.
	     *
	     * @throws An error if either `widget` or `ref` is invalid.
	     */
	    DockPanel.prototype.insertTop = function (widget, ref) {
	        DockPanelPrivate.insertSplit(this, widget, ref, phosphor_splitpanel_1.Orientation.Vertical, false);
	    };
	    /**
	     * Insert a widget as a new panel to the left of a reference widget.
	     *
	     * @param widget - The widget to insert into the dock panel.
	     *
	     * @param ref - The reference widget. If this is not provided, the
	     *   widget will be inserted at the left edge of the dock panel.
	     *
	     * @throws An error if either `widget` or `ref` is invalid.
	     */
	    DockPanel.prototype.insertLeft = function (widget, ref) {
	        DockPanelPrivate.insertSplit(this, widget, ref, phosphor_splitpanel_1.Orientation.Horizontal, false);
	    };
	    /**
	     * Insert a widget as a new panel to the right of a reference widget.
	     *
	     * @param widget - The widget to insert into the dock panel.
	     *
	     * @param ref - The reference widget. If this is not provided, the
	     *   widget will be inserted at the right edge of the dock panel.
	     *
	     * @throws An error if either `widget` or `ref` is invalid.
	     */
	    DockPanel.prototype.insertRight = function (widget, ref) {
	        DockPanelPrivate.insertSplit(this, widget, ref, phosphor_splitpanel_1.Orientation.Horizontal, true);
	    };
	    /**
	     * Insert a widget as a new panel below a reference widget.
	     *
	     * @param widget - The widget to insert into the dock panel.
	     *
	     * @param ref - The reference widget. If this is not provided, the
	     *   widget will be inserted at the bottom edge of the dock panel.
	     *
	     * @throws An error if either `widget` or `ref` is invalid.
	     */
	    DockPanel.prototype.insertBottom = function (widget, ref) {
	        DockPanelPrivate.insertSplit(this, widget, ref, phosphor_splitpanel_1.Orientation.Vertical, true);
	    };
	    /**
	     * Insert a widget as a sibling tab before a reference widget.
	     *
	     * @param widget - The widget to insert into the dock panel.
	     *
	     * @param ref - The reference widget. If this is not provided, the
	     *   widget will be inserted as the first tab in the top-left panel.
	     *
	     * @throws An error if either `widget` or `ref` is invalid.
	     */
	    DockPanel.prototype.insertTabBefore = function (widget, ref) {
	        DockPanelPrivate.insertTab(this, widget, ref, false);
	    };
	    /**
	     * Insert a widget as a sibling tab after a reference widget.
	     *
	     * @param widget - The widget to insert into the dock panel.
	     *
	     * @param ref - The reference widget. If this is not provided, the
	     *   widget will be inserted as the last tab in the top-left panel.
	     *
	     * @throws An error if either `widget` or `ref` is invalid.
	     */
	    DockPanel.prototype.insertTabAfter = function (widget, ref) {
	        DockPanelPrivate.insertTab(this, widget, ref, true);
	    };
	    /**
	     * Ensure the tab for the specified content widget is selected.
	     *
	     * @param widget - The content widget of interest.
	     *
	     * #### Notes
	     * If the widget is not contained in the dock panel, or is already
	     * the selected tab in its respective tab panel, this is a no-op.
	     */
	    DockPanel.prototype.selectWidget = function (widget) {
	        DockPanelPrivate.selectWidget(this, widget);
	    };
	    /**
	     * Handle the DOM events for the dock panel.
	     *
	     * @param event - The DOM event sent to the dock panel.
	     *
	     * #### Notes
	     * This method implements the DOM `EventListener` interface and is
	     * called in response to events on the dock panel's node. It should
	     * not be called directly by user code.
	     */
	    DockPanel.prototype.handleEvent = function (event) {
	        switch (event.type) {
	            case 'p-dragenter':
	                this._evtDragEnter(event);
	                break;
	            case 'p-dragleave':
	                this._evtDragLeave(event);
	                break;
	            case 'p-dragover':
	                this._evtDragOver(event);
	                break;
	            case 'p-drop':
	                this._evtDrop(event);
	                break;
	        }
	    };
	    /**
	     * A message handler invoked on an `'after-attach'` message.
	     */
	    DockPanel.prototype.onAfterAttach = function (msg) {
	        var node = this.node;
	        node.addEventListener('p-dragenter', this);
	        node.addEventListener('p-dragleave', this);
	        node.addEventListener('p-dragover', this);
	        node.addEventListener('p-drop', this);
	    };
	    /**
	     * A message handler invoked on a `'before-detach'` message.
	     */
	    DockPanel.prototype.onBeforeDetach = function (msg) {
	        var node = this.node;
	        node.removeEventListener('p-dragenter', this);
	        node.removeEventListener('p-dragleave', this);
	        node.removeEventListener('p-dragover', this);
	        node.removeEventListener('p-drop', this);
	    };
	    /**
	     * Handle the `'p-dragenter'` event for the dock panel.
	     */
	    DockPanel.prototype._evtDragEnter = function (event) {
	        if (event.mimeData.hasData(FACTORY_MIME)) {
	            event.preventDefault();
	            event.stopPropagation();
	        }
	    };
	    /**
	     * Handle the `'p-dragleave'` event for the dock panel.
	     */
	    DockPanel.prototype._evtDragLeave = function (event) {
	        event.preventDefault();
	        event.stopPropagation();
	        var related = event.relatedTarget;
	        if (!related || !this.node.contains(related)) {
	            DockPanelPrivate.hideOverlay(this);
	        }
	    };
	    /**
	     * Handle the `'p-dragover'` event for the dock panel.
	     */
	    DockPanel.prototype._evtDragOver = function (event) {
	        event.preventDefault();
	        event.stopPropagation();
	        var x = event.clientX;
	        var y = event.clientY;
	        var zone = DockPanelPrivate.showOverlay(this, x, y);
	        if (zone === 10 /* Invalid */) {
	            event.dropAction = phosphor_dragdrop_1.DropAction.None;
	        }
	        else {
	            event.dropAction = event.proposedAction;
	        }
	    };
	    /**
	     * Handle the `'p-drop'` event for the dock panel.
	     */
	    DockPanel.prototype._evtDrop = function (event) {
	        event.preventDefault();
	        event.stopPropagation();
	        DockPanelPrivate.hideOverlay(this);
	        if (event.proposedAction === phosphor_dragdrop_1.DropAction.None) {
	            event.dropAction = phosphor_dragdrop_1.DropAction.None;
	            return;
	        }
	        var x = event.clientX;
	        var y = event.clientY;
	        var target = DockPanelPrivate.findDockTarget(this, x, y);
	        if (target.zone === 10 /* Invalid */) {
	            event.dropAction = phosphor_dragdrop_1.DropAction.None;
	            return;
	        }
	        var factory = event.mimeData.getData(FACTORY_MIME);
	        if (typeof factory !== 'function') {
	            event.dropAction = phosphor_dragdrop_1.DropAction.None;
	            return;
	        }
	        var widget = factory();
	        if (!(widget instanceof phosphor_widget_1.Widget)) {
	            event.dropAction = phosphor_dragdrop_1.DropAction.None;
	            return;
	        }
	        DockPanelPrivate.handleDrop(this, widget, target);
	        event.dropAction = event.proposedAction;
	    };
	    return DockPanel;
	})(phosphor_widget_1.Widget);
	exports.DockPanel = DockPanel;
	/**
	 * A custom tab panel used by a DockPanel.
	 */
	var DockTabPanel = (function (_super) {
	    __extends(DockTabPanel, _super);
	    /**
	     * Construct a new dock tab panel.
	     */
	    function DockTabPanel() {
	        _super.call(this);
	        this.addClass(TAB_PANEL_CLASS);
	        this.tabBar.tabsMovable = true;
	    }
	    return DockTabPanel;
	})(phosphor_tabs_1.TabPanel);
	/**
	 * A custom split panel used by a DockPanel.
	 */
	var DockSplitPanel = (function (_super) {
	    __extends(DockSplitPanel, _super);
	    /**
	     * Construct a new dock split panel.
	     */
	    function DockSplitPanel(orientation, spacing) {
	        _super.call(this);
	        this.addClass(SPLIT_PANEL_CLASS);
	        this.orientation = orientation;
	        this.spacing = spacing;
	    }
	    return DockSplitPanel;
	})(phosphor_splitpanel_1.SplitPanel);
	/**
	 * A node wrapper used as an overlay dock indicator for a dock panel.
	 */
	var DockPanelOverlay = (function (_super) {
	    __extends(DockPanelOverlay, _super);
	    /**
	     * Construct a new dock panel overlay.
	     */
	    function DockPanelOverlay() {
	        _super.call(this);
	        this._zone = 10 /* Invalid */;
	        this.addClass(OVERLAY_CLASS);
	        this.addClass(HIDDEN_CLASS);
	    }
	    /**
	     * Show the overlay with the given zone and geometry
	     */
	    DockPanelOverlay.prototype.show = function (zone, left, top, width, height) {
	        var style = this.node.style;
	        style.top = top + 'px';
	        style.left = left + 'px';
	        style.width = width + 'px';
	        style.height = height + 'px';
	        this.removeClass(HIDDEN_CLASS);
	        this._setZone(zone);
	    };
	    /**
	     * Hide the overlay and reset its zone.
	     */
	    DockPanelOverlay.prototype.hide = function () {
	        this.addClass(HIDDEN_CLASS);
	        this._setZone(10 /* Invalid */);
	    };
	    /**
	     * Set the dock zone for the overlay.
	     */
	    DockPanelOverlay.prototype._setZone = function (zone) {
	        if (zone === this._zone) {
	            return;
	        }
	        var oldClass = DockPanelOverlay.zoneMap[this._zone];
	        var newClass = DockPanelOverlay.zoneMap[zone];
	        if (oldClass)
	            this.removeClass(oldClass);
	        if (newClass)
	            this.addClass(newClass);
	        this._zone = zone;
	    };
	    /**
	     * A mapping of dock zone enum value to modifier class.
	     */
	    DockPanelOverlay.zoneMap = [
	        ROOT_TOP_CLASS,
	        ROOT_LEFT_CLASS,
	        ROOT_RIGHT_CLASS,
	        ROOT_BOTTOM_CLASS,
	        ROOT_CENTER_CLASS,
	        PANEL_TOP_CLASS,
	        PANEL_LEFT_CLASS,
	        PANEL_RIGHT_CLASS,
	        PANEL_BOTTOM_CLASS,
	        PANEL_CENTER_CLASS
	    ];
	    return DockPanelOverlay;
	})(phosphor_nodewrapper_1.NodeWrapper);
	/**
	 * The namespace for the `DockPanel` class private data.
	 */
	var DockPanelPrivate;
	(function (DockPanelPrivate) {
	    /**
	     * The property descriptor for the spacing between panels.
	     */
	    DockPanelPrivate.spacingProperty = new phosphor_properties_1.Property({
	        name: 'spacing',
	        value: 3,
	        coerce: function (owner, value) { return Math.max(0, value | 0); },
	        changed: onSpacingChanged,
	    });
	    /**
	     * Insert a widget as a new split panel in a dock panel.
	     */
	    function insertSplit(owner, widget, ref, orientation, after) {
	        // Ensure the insert args are valid.
	        validateInsertArgs(owner, widget, ref);
	        // If the widget is the same as the ref, there's nothing to do.
	        if (widget === ref) {
	            return;
	        }
	        // Unparent the widget before performing the insert. This ensures
	        // that structural changes to the dock panel occur before searching
	        // for the insert location.
	        widget.parent = null;
	        // Setup the new tab panel to host the widget.
	        var tabPanel = createTabPanel();
	        tabPanel.addChild(widget);
	        // If there is no root, add the new tab panel as the root.
	        if (!getRoot(owner)) {
	            setRoot(owner, tabPanel);
	            return;
	        }
	        // If the ref widget is null, split the root panel.
	        if (!ref) {
	            var root = ensureSplitRoot(owner, orientation);
	            var sizes_1 = root.sizes();
	            var count = sizes_1.length;
	            arrays.insert(sizes_1, after ? count : 0, 0.5);
	            root.insertChild(after ? count : 0, tabPanel);
	            root.setSizes(sizes_1);
	            return;
	        }
	        // Lookup the tab panel for the ref widget.
	        var refTabPanel = findTabPanel(ref);
	        // If the ref tab panel parent is the dock panel, split the root.
	        if (refTabPanel.parent === owner) {
	            var root = ensureSplitRoot(owner, orientation);
	            root.insertChild(after ? 1 : 0, tabPanel);
	            root.setSizes([1, 1]);
	            return;
	        }
	        // Assert the parent of the ref tab panel is a dock split panel.
	        if (!(refTabPanel.parent instanceof DockSplitPanel)) {
	            internalError();
	        }
	        // Cast the ref tab panel parent to a dock split panel.
	        var splitPanel = refTabPanel.parent;
	        // If the split panel is the correct orientation, the widget
	        // can be inserted directly and sized to 1/2 the ref space.
	        if (splitPanel.orientation === orientation) {
	            var i_1 = splitPanel.childIndex(refTabPanel);
	            var sizes_2 = splitPanel.sizes();
	            var size = sizes_2[i_1] = sizes_2[i_1] / 2;
	            arrays.insert(sizes_2, after ? i_1 + 1 : i_1, size);
	            splitPanel.insertChild(after ? i_1 + 1 : i_1, tabPanel);
	            splitPanel.setSizes(sizes_2);
	            return;
	        }
	        // If the split panel only has a single child, its orientation
	        // can be changed directly and its sizes set to a 1:1 ratio.
	        if (splitPanel.childCount() === 1) {
	            splitPanel.orientation = orientation;
	            splitPanel.insertChild(after ? 1 : 0, tabPanel);
	            splitPanel.setSizes([1, 1]);
	            return;
	        }
	        // Assert the split panel has more than one child.
	        if (splitPanel.childCount() === 0) {
	            internalError();
	        }
	        // Otherwise, a new split panel with the correct orientation needs
	        // to be created to hold the ref panel and tab panel, and inserted
	        // in the previous location of the ref panel.
	        var sizes = splitPanel.sizes();
	        var i = splitPanel.childIndex(refTabPanel);
	        var childSplit = new DockSplitPanel(orientation, owner.spacing);
	        childSplit.addChild(refTabPanel);
	        childSplit.insertChild(after ? 1 : 0, tabPanel);
	        splitPanel.insertChild(i, childSplit);
	        splitPanel.setSizes(sizes);
	        childSplit.setSizes([1, 1]);
	    }
	    DockPanelPrivate.insertSplit = insertSplit;
	    /**
	     * Insert a widget as a sibling tab in a dock panel.
	     */
	    function insertTab(owner, widget, ref, after) {
	        // Ensure the insert args are valid.
	        validateInsertArgs(owner, widget, ref);
	        // If the widget is the same as the ref, there's nothing to do.
	        if (widget === ref) {
	            return;
	        }
	        // Unparent the widget before performing the insert. This ensures
	        // that structural changes to the dock panel occur before searching
	        // for the insert location.
	        widget.parent = null;
	        // Find the index and tab panel for the insert operation.
	        var index;
	        var tabPanel;
	        if (ref) {
	            tabPanel = findTabPanel(ref);
	            index = tabPanel.childIndex(ref) + (after ? 1 : 0);
	        }
	        else {
	            tabPanel = ensureFirstTabPanel(owner);
	            index = after ? tabPanel.childCount() : 0;
	        }
	        // Insert the widget into the tab panel at the proper location.
	        tabPanel.insertChild(index, widget);
	    }
	    DockPanelPrivate.insertTab = insertTab;
	    /**
	     * Ensure the given widget is the current widget in its tab panel.
	     *
	     * This is a no-op if the widget is not contained in the dock panel.
	     */
	    function selectWidget(owner, widget) {
	        if (!dockPanelContains(owner, widget))
	            return;
	        widget.parent.parent.currentWidget = widget;
	    }
	    DockPanelPrivate.selectWidget = selectWidget;
	    /**
	     * Hide the dock panel overlay for the given dock panel.
	     */
	    function hideOverlay(owner) {
	        getOverlay(owner).hide();
	    }
	    DockPanelPrivate.hideOverlay = hideOverlay;
	    /**
	     * Show the dock panel overlay indicator at the given client position.
	     *
	     * If the position is not over a dock zone, the overlay is hidden.
	     *
	     * This returns the dock zone used to display the overlay.
	     */
	    function showOverlay(owner, clientX, clientY) {
	        // Find the dock target for the given client position.
	        var target = findDockTarget(owner, clientX, clientY);
	        // If the dock zone is invalid, hide the overlay and bail.
	        if (target.zone === 10 /* Invalid */) {
	            hideOverlay(owner);
	            return target.zone;
	        }
	        // Setup the variables needed to compute the overlay geometry.
	        var top;
	        var left;
	        var width;
	        var height;
	        var pcr;
	        var box = phosphor_domutil_1.boxSizing(owner.node); // TODO cache this?
	        var rect = owner.node.getBoundingClientRect();
	        // Compute the overlay geometry based on the dock zone.
	        switch (target.zone) {
	            case 0 /* RootTop */:
	                top = box.paddingTop;
	                left = box.paddingLeft;
	                width = rect.width - box.horizontalSum;
	                height = (rect.height - box.verticalSum) / 3;
	                break;
	            case 1 /* RootLeft */:
	                top = box.paddingTop;
	                left = box.paddingLeft;
	                width = (rect.width - box.horizontalSum) / 3;
	                height = rect.height - box.verticalSum;
	                break;
	            case 2 /* RootRight */:
	                top = box.paddingTop;
	                width = (rect.width - box.horizontalSum) / 3;
	                left = box.paddingLeft + 2 * width;
	                height = rect.height - box.verticalSum;
	                break;
	            case 3 /* RootBottom */:
	                height = (rect.height - box.verticalSum) / 3;
	                top = box.paddingTop + 2 * height;
	                left = box.paddingLeft;
	                width = rect.width - box.horizontalSum;
	                break;
	            case 4 /* RootCenter */:
	                top = box.paddingTop;
	                left = box.paddingLeft;
	                width = rect.width - box.horizontalSum;
	                height = rect.height - box.verticalSum;
	                break;
	            case 5 /* PanelTop */:
	                pcr = target.panel.node.getBoundingClientRect();
	                top = pcr.top - rect.top - box.borderTop;
	                left = pcr.left - rect.left - box.borderLeft;
	                width = pcr.width;
	                height = pcr.height / 2;
	                break;
	            case 6 /* PanelLeft */:
	                pcr = target.panel.node.getBoundingClientRect();
	                top = pcr.top - rect.top - box.borderTop;
	                left = pcr.left - rect.left - box.borderLeft;
	                width = pcr.width / 2;
	                height = pcr.height;
	                break;
	            case 7 /* PanelRight */:
	                pcr = target.panel.node.getBoundingClientRect();
	                top = pcr.top - rect.top - box.borderTop;
	                left = pcr.left - rect.left - box.borderLeft + pcr.width / 2;
	                width = pcr.width / 2;
	                height = pcr.height;
	                break;
	            case 8 /* PanelBottom */:
	                pcr = target.panel.node.getBoundingClientRect();
	                top = pcr.top - rect.top - box.borderTop + pcr.height / 2;
	                left = pcr.left - rect.left - box.borderLeft;
	                width = pcr.width;
	                height = pcr.height / 2;
	                break;
	            case 9 /* PanelCenter */:
	                pcr = target.panel.node.getBoundingClientRect();
	                top = pcr.top - rect.top - box.borderTop;
	                left = pcr.left - rect.left - box.borderLeft;
	                width = pcr.width;
	                height = pcr.height;
	                break;
	        }
	        // Show the overlay and return the dock zone.
	        getOverlay(owner).show(target.zone, left, top, width, height);
	        return target.zone;
	    }
	    DockPanelPrivate.showOverlay = showOverlay;
	    /**
	     * Find the dock target for the given client position.
	     */
	    function findDockTarget(owner, clientX, clientY) {
	        var root = getRoot(owner);
	        if (!root) {
	            return { zone: 4 /* RootCenter */, panel: null };
	        }
	        if (!phosphor_domutil_1.hitTest(root.node, clientX, clientY)) {
	            return { zone: 10 /* Invalid */, panel: null };
	        }
	        var edgeZone = getEdgeZone(root.node, clientX, clientY);
	        if (edgeZone !== 10 /* Invalid */) {
	            return { zone: edgeZone, panel: null };
	        }
	        var hitPanel = iterTabPanels(root, function (tabs) {
	            return phosphor_domutil_1.hitTest(tabs.node, clientX, clientY) ? tabs : void 0;
	        });
	        if (!hitPanel) {
	            return { zone: 10 /* Invalid */, panel: null };
	        }
	        var panelZone = getPanelZone(hitPanel.node, clientX, clientY);
	        return { zone: panelZone, panel: hitPanel };
	    }
	    DockPanelPrivate.findDockTarget = findDockTarget;
	    /**
	     * Drop a widget onto a dock panel using the given dock target.
	     */
	    function handleDrop(owner, widget, target) {
	        // Do nothing if the dock zone is invalid.
	        if (target.zone === 10 /* Invalid */) {
	            return;
	        }
	        // Handle the simple case of root drops first.
	        switch (target.zone) {
	            case 0 /* RootTop */:
	                owner.insertTop(widget);
	                return;
	            case 1 /* RootLeft */:
	                owner.insertLeft(widget);
	                return;
	            case 2 /* RootRight */:
	                owner.insertRight(widget);
	                return;
	            case 3 /* RootBottom */:
	                owner.insertBottom(widget);
	                return;
	            case 4 /* RootCenter */:
	                owner.insertLeft(widget);
	                return;
	        }
	        // Otherwise, it's a panel drop, and that requires more checks.
	        // Do nothing if the widget is dropped as a tab on its own panel.
	        if (target.zone === 9 /* PanelCenter */) {
	            if (target.panel.childIndex(widget) !== -1) {
	                return;
	            }
	        }
	        // Do nothing if the panel only contains the drop widget.
	        if (target.panel.childCount() === 1) {
	            if (target.panel.childAt(0) === widget) {
	                return;
	            }
	        }
	        // Find a suitable reference widget for the drop.
	        var n = target.panel.childCount();
	        var ref = target.panel.childAt(n - 1);
	        if (ref === widget) {
	            ref = target.panel.childAt(n - 2);
	        }
	        // Insert the widget based on the panel zone.
	        switch (target.zone) {
	            case 5 /* PanelTop */:
	                owner.insertTop(widget, ref);
	                return;
	            case 6 /* PanelLeft */:
	                owner.insertLeft(widget, ref);
	                return;
	            case 7 /* PanelRight */:
	                owner.insertRight(widget, ref);
	                return;
	            case 8 /* PanelBottom */:
	                owner.insertBottom(widget, ref);
	                return;
	            case 9 /* PanelCenter */:
	                owner.insertTabAfter(widget, ref);
	                selectWidget(owner, widget);
	                return;
	        }
	    }
	    DockPanelPrivate.handleDrop = handleDrop;
	    /**
	     * A private attached property for the dock panel root.
	     */
	    var rootProperty = new phosphor_properties_1.Property({
	        name: 'root',
	        value: null,
	        changed: onRootChanged,
	    });
	    /**
	     * A private attached property for the dock panel overlay.
	     */
	    var overlayProperty = new phosphor_properties_1.Property({
	        name: 'overlay',
	        create: createOverlay,
	    });
	    /**
	     * Get the root panel for a dock panel.
	     */
	    function getRoot(owner) {
	        return rootProperty.get(owner);
	    }
	    /**
	     * Set the root panel for a dock panel.
	     */
	    function setRoot(owner, root) {
	        rootProperty.set(owner, root);
	    }
	    /**
	     * Get the overlay for a dock panel.
	     */
	    function getOverlay(owner) {
	        return overlayProperty.get(owner);
	    }
	    /**
	     * The change handler for the dock panel `rootProperty`.
	     *
	     * This will re-parent the new root and set it as the current widget.
	     *
	     * The old root is not modified.
	     */
	    function onRootChanged(owner, old, root) {
	        if (!root)
	            return;
	        var layout = owner.layout;
	        layout.addChild(root);
	        root.show();
	    }
	    /**
	     * The creation handler for the dock panel `overlayProperty`.
	     *
	     * This will create and install the overlay for the panel.
	     */
	    function createOverlay(owner) {
	        var overlay = new DockPanelOverlay();
	        owner.node.appendChild(overlay.node);
	        return overlay;
	    }
	    /**
	     * The change handler for the `spacing` property of a dock panel.
	     */
	    function onSpacingChanged(owner, old, spacing) {
	        var root = getRoot(owner);
	        if (root instanceof DockSplitPanel) {
	            updateSpacing(root, spacing);
	        }
	    }
	    /**
	     * Recursively update the spacing of a dock split panel.
	     */
	    function updateSpacing(panel, spacing) {
	        for (var i = 0, n = panel.childCount(); i < n; ++i) {
	            var child = panel.childAt(i);
	            if (child instanceof DockSplitPanel) {
	                updateSpacing(child, spacing);
	            }
	        }
	        panel.spacing = spacing;
	    }
	    /**
	     * Throw an internal dock panel error.
	     */
	    function internalError() {
	        throw new Error('Internal DockPanel Error.');
	    }
	    /**
	     * Test whether a dock panel contains the given widget.
	     *
	     * For this condition to be `true`, the widget must be a logical child
	     * of a `DockTabPanel`, which itself must be a proper descendant of the
	     * given dock panel.
	     */
	    function dockPanelContains(owner, widget) {
	        var stack = widget.parent;
	        if (!stack) {
	            return false;
	        }
	        var tabs = stack.parent;
	        if (!(tabs instanceof DockTabPanel)) {
	            return false;
	        }
	        var parent = tabs.parent;
	        while (parent) {
	            if (parent === owner) {
	                return true;
	            }
	            if (!(parent instanceof DockSplitPanel)) {
	                return false;
	            }
	            parent = parent.parent;
	        }
	        return false;
	    }
	    /**
	     * Find the ancestor dock tab panel for the given widget.
	     *
	     * This assumes the widget already belongs to a dock panel, and will
	     * throw an error if that assumption does not hold.
	     */
	    function findTabPanel(widget) {
	        var stack = widget.parent;
	        if (!stack) {
	            internalError();
	        }
	        var tabs = stack.parent;
	        if (!(tabs instanceof DockTabPanel)) {
	            internalError();
	        }
	        return tabs;
	    }
	    /**
	     * Find the first dock tab panel for the given dock panel.
	     *
	     * This returns `null` if the dock panel has no content. It will throw
	     * an error if the structure of the dock panel is found to be invalid.
	     */
	    function findFirstTabPanel(owner) {
	        var root = getRoot(owner);
	        while (root) {
	            if (root instanceof DockTabPanel) {
	                return root;
	            }
	            if (!(root instanceof DockSplitPanel) || root.childCount() === 0) {
	                internalError();
	            }
	            root = root.childAt(0);
	        }
	        return null;
	    }
	    /**
	     * Get or create the first dock tab panel for the given dock panel.
	     *
	     * If dock panel has no root, a new tab panel will be created and
	     * added as the root. An error will be thrown if the structure of
	     * the dock panel is found to be invalid.
	     */
	    function ensureFirstTabPanel(owner) {
	        var tabs = findFirstTabPanel(owner);
	        if (!tabs) {
	            tabs = createTabPanel();
	            setRoot(owner, tabs);
	        }
	        return tabs;
	    }
	    /**
	     * Ensure the root panel is a splitter with the given orientation.
	     *
	     * This will throw an error if the panel does not have a current root,
	     * since that would violate the invariants of the dock panel structure.
	     */
	    function ensureSplitRoot(owner, orientation) {
	        var oldRoot = getRoot(owner);
	        if (!oldRoot) {
	            internalError();
	        }
	        if (oldRoot instanceof DockSplitPanel) {
	            if (oldRoot.orientation === orientation) {
	                return oldRoot;
	            }
	            if (oldRoot.childCount() <= 1) {
	                oldRoot.orientation = orientation;
	                return oldRoot;
	            }
	        }
	        var newRoot = new DockSplitPanel(orientation, owner.spacing);
	        newRoot.addChild(oldRoot);
	        setRoot(owner, newRoot);
	        return newRoot;
	    }
	    /**
	     * Validate the insert arguments for a dock panel.
	     *
	     * This will throw an error if the target widget is null, or if the
	     * reference widget is not null and not contained by the dock panel.
	     */
	    function validateInsertArgs(owner, widget, ref) {
	        if (!widget) {
	            throw new Error('Target widget is null.');
	        }
	        if (ref && !dockPanelContains(owner, ref)) {
	            throw new Error('Reference widget not contained by the dock panel.');
	        }
	    }
	    /**
	     * Recursively iterate over the dock tab panels of a root panel.
	     *
	     * Iteration stops if the callback returns anything but `undefined`.
	     */
	    function iterTabPanels(root, callback) {
	        if (root instanceof DockTabPanel) {
	            return callback(root);
	        }
	        if (!(root instanceof DockSplitPanel)) {
	            internalError();
	        }
	        for (var i = 0; i < root.childCount(); ++i) {
	            var child = root.childAt(i);
	            var result = iterTabPanels(child, callback);
	            if (result !== void 0)
	                return result;
	        }
	        return void 0;
	    }
	    /**
	     * Get the root edge zone for the given node and client position.
	     *
	     * This assumes the position lies within the node's client rect.
	     *
	     * Returns the `Invalid` zone if the position is not within an edge.
	     */
	    function getEdgeZone(node, x, y) {
	        var zone;
	        var rect = node.getBoundingClientRect();
	        if (x < rect.left + EDGE_SIZE) {
	            if (y - rect.top < x - rect.left) {
	                zone = 0 /* RootTop */;
	            }
	            else if (rect.bottom - y < x - rect.left) {
	                zone = 3 /* RootBottom */;
	            }
	            else {
	                zone = 1 /* RootLeft */;
	            }
	        }
	        else if (x >= rect.right - EDGE_SIZE) {
	            if (y - rect.top < rect.right - x) {
	                zone = 0 /* RootTop */;
	            }
	            else if (rect.bottom - y < rect.right - x) {
	                zone = 3 /* RootBottom */;
	            }
	            else {
	                zone = 2 /* RootRight */;
	            }
	        }
	        else if (y < rect.top + EDGE_SIZE) {
	            zone = 0 /* RootTop */;
	        }
	        else if (y >= rect.bottom - EDGE_SIZE) {
	            zone = 3 /* RootBottom */;
	        }
	        else {
	            zone = 10 /* Invalid */;
	        }
	        return zone;
	    }
	    /**
	     * Get the panel zone for the given node and position.
	     *
	     * This assumes the position lies within the node's client rect.
	     *
	     * This always returns a valid zone.
	     */
	    function getPanelZone(node, x, y) {
	        var zone;
	        var rect = node.getBoundingClientRect();
	        var fracX = (x - rect.left) / rect.width;
	        var fracY = (y - rect.top) / rect.height;
	        if (fracX < 1 / 3) {
	            if (fracY < fracX) {
	                zone = 5 /* PanelTop */;
	            }
	            else if (1 - fracY < fracX) {
	                zone = 8 /* PanelBottom */;
	            }
	            else {
	                zone = 6 /* PanelLeft */;
	            }
	        }
	        else if (fracX < 2 / 3) {
	            if (fracY < 1 / 3) {
	                zone = 5 /* PanelTop */;
	            }
	            else if (fracY < 2 / 3) {
	                zone = 9 /* PanelCenter */;
	            }
	            else {
	                zone = 8 /* PanelBottom */;
	            }
	        }
	        else {
	            if (fracY < 1 - fracX) {
	                zone = 5 /* PanelTop */;
	            }
	            else if (fracY > fracX) {
	                zone = 8 /* PanelBottom */;
	            }
	            else {
	                zone = 7 /* PanelRight */;
	            }
	        }
	        return zone;
	    }
	    /**
	     * The current tab drag object.
	     */
	    var currentDrag = null;
	    /**
	     * Create a new tab panel for a dock panel.
	     */
	    function createTabPanel() {
	        var panel = new DockTabPanel();
	        panel.tabBar.tabDetachRequested.connect(onTabDetachRequested);
	        panel.stackedPanel.widgetRemoved.connect(onWidgetRemoved);
	        return panel;
	    }
	    /**
	     * Remove an empty dock tab panel from the hierarchy.
	     *
	     * This ensures that the hierarchy is kept consistent by merging an
	     * ancestor split panel when it contains only a single child widget.
	     */
	    function removeTabPanel(tabPanel) {
	        // Assert the tab panel is empty.
	        if (tabPanel.childCount() !== 0) {
	            internalError();
	        }
	        // If the parent of the tab panel is a dock panel, just remove it.
	        if (tabPanel.parent instanceof DockPanel) {
	            setRoot(tabPanel.parent, null);
	            tabPanel.dispose();
	            return;
	        }
	        // Assert the tab panel parent is a dock split panel.
	        if (!(tabPanel.parent instanceof DockSplitPanel)) {
	            internalError();
	        }
	        // Cast the tab panel parent to a dock split panel.
	        var splitPanel = tabPanel.parent;
	        // Assert the split panel has at least two children.
	        if (splitPanel.childCount() < 2) {
	            internalError();
	        }
	        // Dispose the tab panel to ensure its resources are released.
	        tabPanel.dispose();
	        // If the split panel still has multiple children, there is
	        // nothing more to do.
	        if (splitPanel.childCount() > 1) {
	            return;
	        }
	        // Extract the remaining child from the split panel.
	        var child = splitPanel.childAt(0);
	        // Assert the remaining child is a proper panel type.
	        if (!(child instanceof DockTabPanel) && !(child instanceof DockSplitPanel)) {
	            internalError();
	        }
	        // If the parent of the split panel is a dock panel, replace it.
	        if (splitPanel.parent instanceof DockPanel) {
	            setRoot(splitPanel.parent, child);
	            splitPanel.dispose();
	            return;
	        }
	        // Assert the split panel parent is a dock split panel.
	        if (!(splitPanel.parent instanceof DockSplitPanel)) {
	            internalError();
	        }
	        // Cast the split panel parent to a dock split panel.
	        var grandPanel = splitPanel.parent;
	        // If the child is a dock tab panel, replace the split panel.
	        if (child instanceof DockTabPanel) {
	            var sizes = grandPanel.sizes();
	            var index_1 = grandPanel.childIndex(splitPanel);
	            splitPanel.parent = null;
	            grandPanel.insertChild(index_1, child);
	            grandPanel.setSizes(sizes);
	            splitPanel.dispose();
	            return;
	        }
	        // Cast the child to a dock split panel.
	        var childSplit = child;
	        // Child splitters have an orthogonal orientation to their parent.
	        // Assert the orientation of the child matches the grand parent.
	        if (childSplit.orientation !== grandPanel.orientation) {
	            internalError();
	        }
	        // The grand children can now be merged with their grand parent.
	        // Start by fetching the relevant current sizes and insert index.
	        var index = grandPanel.childIndex(splitPanel);
	        var childSizes = childSplit.sizes();
	        var grandSizes = grandPanel.sizes();
	        // Remove the split panel and store its share of the size.
	        splitPanel.parent = null;
	        var sizeShare = arrays.removeAt(grandSizes, index);
	        // Merge the grand children and maintain their relative size.
	        for (var i = 0; childSplit.childCount() !== 0; ++i) {
	            grandPanel.insertChild(index + i, childSplit.childAt(0));
	            arrays.insert(grandSizes, index + i, sizeShare * childSizes[i]);
	        }
	        // Update the grand parent sizes and dispose the removed panel.
	        grandPanel.setSizes(grandSizes);
	        splitPanel.dispose();
	    }
	    /**
	     * Handle the `tabDetachRequested` signal from a dock tab bar.
	     */
	    function onTabDetachRequested(sender, args) {
	        // Do nothing if a drag is already in progress.
	        if (currentDrag) {
	            return;
	        }
	        // Release the tab bar's hold on the mouse.
	        sender.releaseMouse();
	        // Setup the mime data for the drag operation.
	        var mimeData = new phosphor_dragdrop_1.MimeData();
	        var widget = args.item;
	        mimeData.setData(FACTORY_MIME, function () { return widget; });
	        // Create the drag image for the drag operation.
	        var tab = sender.tabAt(args.index);
	        var dragImage = tab.cloneNode(true);
	        // Create the drag object to manage the drag-drop operation.
	        currentDrag = new phosphor_dragdrop_1.Drag({
	            mimeData: mimeData,
	            dragImage: dragImage,
	            proposedAction: phosphor_dragdrop_1.DropAction.Move,
	            supportedActions: phosphor_dragdrop_1.DropActions.Move,
	        });
	        // Start the drag operation and cleanup when done.
	        tab.classList.add(HIDDEN_CLASS);
	        currentDrag.start(args.clientX, args.clientY).then(function () {
	            currentDrag = null;
	            tab.classList.remove(HIDDEN_CLASS);
	        });
	    }
	    /**
	     * Handle the `widgetRemvoed` signal for a dock stacked panel.
	     */
	    function onWidgetRemoved(sender, widget) {
	        if (sender.childCount() === 0) {
	            removeTabPanel(sender.parent);
	        }
	    }
	})(DockPanelPrivate || (DockPanelPrivate = {}));


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var phosphor_domutil_1 = __webpack_require__(7);
	/**
	 * The class name added to drag image nodes.
	 */
	var DRAG_IMAGE_CLASS = 'p-mod-drag-image';
	/**
	 * An enum which defines the possible independent drop actions.
	 */
	(function (DropAction) {
	    /**
	     * No item may be dropped.
	     */
	    DropAction[DropAction["None"] = 0] = "None";
	    /**
	     * The item is copied into its new location.
	     */
	    DropAction[DropAction["Copy"] = 1] = "Copy";
	    /**
	     * The item is linked to its new location.
	     */
	    DropAction[DropAction["Link"] = 2] = "Link";
	    /**
	     * The item is moved to its new location.
	     */
	    DropAction[DropAction["Move"] = 4] = "Move";
	})(exports.DropAction || (exports.DropAction = {}));
	var DropAction = exports.DropAction;
	/**
	 * An enum which defines the combinations of possible drop actions.
	 */
	(function (DropActions) {
	    /**
	     * No drop action is supported.
	     */
	    DropActions[DropActions["None"] = 0] = "None";
	    /**
	     * The item may be copied to its new location.
	     */
	    DropActions[DropActions["Copy"] = 1] = "Copy";
	    /**
	     * The item may be linked to its new location.
	     */
	    DropActions[DropActions["Link"] = 2] = "Link";
	    /**
	     * The item may be moved to its new location.
	     */
	    DropActions[DropActions["Move"] = 4] = "Move";
	    /**
	     * The item may be copied or linked to its new location.
	     */
	    DropActions[DropActions["CopyLink"] = 3] = "CopyLink";
	    /**
	     * The item may be copied or moved to its new location.
	     */
	    DropActions[DropActions["CopyMove"] = 5] = "CopyMove";
	    /**
	     * The item may be linked or moved to its new location.
	     */
	    DropActions[DropActions["LinkMove"] = 6] = "LinkMove";
	    /**
	     * The item may be copied, linked, or moved to its new location.
	     */
	    DropActions[DropActions["All"] = 7] = "All";
	})(exports.DropActions || (exports.DropActions = {}));
	var DropActions = exports.DropActions;
	/**
	 * An object which stores MIME data for drag-drop operations.
	 *
	 * #### Notes
	 * This class does not attempt to enforce "correctness" of MIME types
	 * and their associated data. Since this drag-drop system is designed
	 * to transfer arbitrary data and objects within the same application,
	 * it assumes that the user provides correct and accurate data.
	 */
	var MimeData = (function () {
	    function MimeData() {
	        this._types = [];
	        this._values = [];
	    }
	    /**
	     * Get an array of the MIME types contains within the dataset.
	     *
	     * @returns A new array of the MIME types, in order of insertion.
	     */
	    MimeData.prototype.types = function () {
	        return this._types.slice();
	    };
	    /**
	     * Test whether the dataset has an entry for the given type.
	     *
	     * @param mime - The MIME type of interest.
	     *
	     * @returns `true` if the dataset contains a value for the given
	     *   MIME type, `false` otherwise.
	     */
	    MimeData.prototype.hasData = function (mime) {
	        return this._types.indexOf(mime) !== -1;
	    };
	    /**
	     * Get the data value for the given MIME type.
	     *
	     * @param mime - The MIME type of interest.
	     *
	     * @returns The value for the given MIME type, or `undefined` if
	     *   the dataset does not contain a value for the type.
	     */
	    MimeData.prototype.getData = function (mime) {
	        var i = this._types.indexOf(mime);
	        return i !== -1 ? this._values[i] : void 0;
	    };
	    /**
	     * Set the data value for the given MIME type.
	     *
	     * @param mime - The MIME type of interest.
	     *
	     * @param data - The data value for the given MIME type.
	     *
	     * #### Notes
	     * This will overwrite any previous entry for the MIME type.
	     */
	    MimeData.prototype.setData = function (mime, data) {
	        this.clearData(mime);
	        this._types.push(mime);
	        this._values.push(data);
	    };
	    /**
	     * Remove the data entry for the given MIME type.
	     *
	     * @param mime - The MIME type of interest.
	     *
	     * #### Notes
	     * This is a no-op if there is no entry for the given MIME type.
	     */
	    MimeData.prototype.clearData = function (mime) {
	        var i = this._types.indexOf(mime);
	        if (i === -1)
	            return;
	        this._types.splice(i, 1);
	        this._values.splice(i, 1);
	    };
	    /**
	     * Remove all data entries from the dataset.
	     */
	    MimeData.prototype.clear = function () {
	        this._types.length = 0;
	        this._values.length = 0;
	    };
	    return MimeData;
	}());
	exports.MimeData = MimeData;
	/**
	 * An object which manages a drag-drop operation.
	 *
	 * A drag object dispatches four different events to drop targets:
	 *
	 * - `'p-dragenter'` - Dispatched when the mouse enters the target
	 *   element. This event must be canceled in order to receive any
	 *   of the other events.
	 *
	 * - `'p-dragover'` - Dispatched when the mouse moves over the drop
	 *   target. It must cancel the event and set the `dropAction` to one
	 *   of the supported actions in order to receive drop events.
	 *
	 * - `'p-dragleave'` - Dispatched when the mouse leaves the target
	 *   element. This includes moving the mouse into child elements.
	 *
	 * - `'p-drop'`- Dispatched when the mouse is released over the target
	 *   element when the target indicates an appropriate drop action. If
	 *   the event is canceled, the indicated drop action is returned to
	 *   the initiator through the resolved promise.
	 *
	 * A drag operation can be canceled at any time by pressing `Escape`
	 * or by disposing the drag object.
	 *
	 * #### Notes
	 * This class is designed to be used when dragging and dropping custom
	 * data *within* a single application. It is *not* a replacement for
	 * the native drag-drop API. Instead, it provides an API which allows
	 * drag operations to be initiated programmatically and enables the
	 * transfer of arbitrary non-string objects; two features which are
	 * not possible with the native drag-drop APIs.
	 */
	var Drag = (function () {
	    /**
	     * Construct a new drag object.
	     *
	     * @param options - The options for initializing the drag.
	     */
	    function Drag(options) {
	        this._disposed = false;
	        this._source = null;
	        this._mimeData = null;
	        this._dragImage = null;
	        this._dropAction = DropAction.None;
	        this._proposedAction = DropAction.Copy;
	        this._supportedActions = DropActions.Copy;
	        this._override = null;
	        this._currentTarget = null;
	        this._currentElement = null;
	        this._promise = null;
	        this._resolve = null;
	        this._mimeData = options.mimeData;
	        if (options.dragImage !== void 0) {
	            this._dragImage = options.dragImage;
	        }
	        if (options.proposedAction !== void 0) {
	            this._proposedAction = options.proposedAction;
	        }
	        if (options.supportedActions !== void 0) {
	            this._supportedActions = options.supportedActions;
	        }
	        if (options.source !== void 0) {
	            this._source = options.source;
	        }
	    }
	    /**
	     * Dispose of the resources held by the drag object.
	     *
	     * #### Notes
	     * This will cancel the drag operation if it is active.
	     *
	     * All calls made after the first call to this method are a no-op.
	     */
	    Drag.prototype.dispose = function () {
	        // Do nothing if the drag object is already disposed.
	        if (this._disposed) {
	            return;
	        }
	        this._disposed = true;
	        // If there is a current target, dispatch a drag leave event.
	        if (this._currentTarget) {
	            var event_1 = createMouseEvent('mouseup', -1, -1);
	            dispatchDragLeave(this, this._currentTarget, null, event_1);
	        }
	        // Finalize the drag object with `None`.
	        this._finalize(DropAction.None);
	    };
	    Object.defineProperty(Drag.prototype, "isDisposed", {
	        /**
	         * Test whether the drag object is disposed.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._disposed;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Drag.prototype, "mimeData", {
	        /**
	         * Get the mime data for the drag object.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._mimeData;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Drag.prototype, "dragImage", {
	        /**
	         * Get the drag image element for the drag object.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._dragImage;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Drag.prototype, "proposedAction", {
	        /**
	         * Get the proposed drop action for the drag object.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._proposedAction;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Drag.prototype, "supportedActions", {
	        /**
	         * Get the supported drop actions for the drag object.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._supportedActions;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Drag.prototype, "source", {
	        /**
	         * Get the drag source for the drag object.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._source;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Start the drag operation at the specified client position.
	     *
	     * @param clientX - The client X position for the drag start.
	     *
	     * @param clientY - The client Y position for the drag start.
	     *
	     * @returns A promise which resolves to the result of the drag.
	     *
	     * #### Notes
	     * If the drag has already been started, the promise created by the
	     * first call to `start` is returned.
	     *
	     * If the drag operation has ended, or if the drag object has been
	     * disposed, the returned promise will resolve to `DropAction.None`.
	     *
	     * The drag object will be automatically disposed when drag operation
	     * completes. This makes `Drag` objects suitable for single use only.
	     *
	     * This method assumes the left mouse button is already held down.
	     */
	    Drag.prototype.start = function (clientX, clientY) {
	        var _this = this;
	        // If the drag object is already disposed, resolve to `None`.
	        if (this._disposed) {
	            return Promise.resolve(DropAction.None);
	        }
	        // If the drag has already been started, return the promise.
	        if (this._promise) {
	            return this._promise;
	        }
	        // Install the document listeners for the drag object.
	        this._addListeners();
	        // Attach the drag image at the specified client position.
	        this._attachDragImage(clientX, clientY);
	        // Create the promise which will be resolved on completion.
	        this._promise = new Promise(function (resolve, reject) {
	            _this._resolve = resolve;
	        });
	        // Trigger a fake move event to kick off the drag operation.
	        var event = createMouseEvent('mousemove', clientX, clientY);
	        document.dispatchEvent(event);
	        // Return the pending promise for the drag operation.
	        return this._promise;
	    };
	    /**
	     * Handle the DOM events for the drag operation.
	     *
	     * @param event - The DOM event sent to the drag object.
	     *
	     * #### Notes
	     * This method implements the DOM `EventListener` interface and is
	     * called in response to events on the document. It should not be
	     * called directly by user code.
	     */
	    Drag.prototype.handleEvent = function (event) {
	        switch (event.type) {
	            case 'mousemove':
	                this._evtMouseMove(event);
	                break;
	            case 'mouseup':
	                this._evtMouseUp(event);
	                break;
	            case 'keydown':
	                this._evtKeyDown(event);
	                break;
	            default:
	                // Stop all other events during drag-drop.
	                event.preventDefault();
	                event.stopPropagation();
	                break;
	        }
	    };
	    /**
	     * Handle the `'mousemove'` event for the drag object.
	     */
	    Drag.prototype._evtMouseMove = function (event) {
	        // Stop all input events during drag-drop.
	        event.preventDefault();
	        event.stopPropagation();
	        // Update the current target node and dispatch enter/leave events.
	        this._updateCurrentTarget(event);
	        // Move the drag image to the specified client position. This is
	        // performed *after* dispatching to prevent unnecessary reflows.
	        this._moveDragImage(event.clientX, event.clientY);
	    };
	    /**
	     * Handle the `'mouseup'` event for the drag object.
	     */
	    Drag.prototype._evtMouseUp = function (event) {
	        // Stop all input events during drag-drop.
	        event.preventDefault();
	        event.stopPropagation();
	        // Do nothing if the left button is not released.
	        if (event.button !== 0) {
	            return;
	        }
	        // Update the current target node and dispatch enter/leave events.
	        // This prevents a subtle issue where the DOM mutates under the
	        // cursor after the last move event but before the drop event.
	        this._updateCurrentTarget(event);
	        // If there is no current target, finalize with `None`.
	        if (!this._currentTarget) {
	            this._finalize(DropAction.None);
	            return;
	        }
	        // If the last drop action was `None`, dispatch a leave event
	        // to the current target and finalize the drag with `None`.
	        if (this._dropAction === DropAction.None) {
	            dispatchDragLeave(this, this._currentTarget, null, event);
	            this._finalize(DropAction.None);
	            return;
	        }
	        // Dispatch the drop event at the current target and finalize
	        // with the resulting drop action.
	        var action = dispatchDrop(this, this._currentTarget, event);
	        this._finalize(action);
	    };
	    /**
	     * Handle the `'keydown'` event for the drag object.
	     */
	    Drag.prototype._evtKeyDown = function (event) {
	        // Stop all input events during drag-drop.
	        event.preventDefault();
	        event.stopPropagation();
	        // Cancel the drag if `Escape` is pressed.
	        if (event.keyCode === 27)
	            this.dispose();
	    };
	    /**
	     * Add the document event listeners for the drag object.
	     */
	    Drag.prototype._addListeners = function () {
	        document.addEventListener('mousedown', this, true);
	        document.addEventListener('mousemove', this, true);
	        document.addEventListener('mouseup', this, true);
	        document.addEventListener('mouseenter', this, true);
	        document.addEventListener('mouseleave', this, true);
	        document.addEventListener('mouseover', this, true);
	        document.addEventListener('mouseout', this, true);
	        document.addEventListener('keydown', this, true);
	        document.addEventListener('keyup', this, true);
	        document.addEventListener('keypress', this, true);
	        document.addEventListener('contextmenu', this, true);
	    };
	    /**
	     * Remove the document event listeners for the drag object.
	     */
	    Drag.prototype._removeListeners = function () {
	        document.removeEventListener('mousedown', this, true);
	        document.removeEventListener('mousemove', this, true);
	        document.removeEventListener('mouseup', this, true);
	        document.removeEventListener('mouseenter', this, true);
	        document.removeEventListener('mouseleave', this, true);
	        document.removeEventListener('mouseover', this, true);
	        document.removeEventListener('mouseout', this, true);
	        document.removeEventListener('keydown', this, true);
	        document.removeEventListener('keyup', this, true);
	        document.removeEventListener('keypress', this, true);
	        document.removeEventListener('contextmenu', this, true);
	    };
	    /**
	     * Update the current target node using the given mouse event.
	     */
	    Drag.prototype._updateCurrentTarget = function (event) {
	        // Fetch common local state.
	        var prevTarget = this._currentTarget;
	        var currTarget = this._currentTarget;
	        var prevElem = this._currentElement;
	        // Find the current indicated element at the given position.
	        var currElem = document.elementFromPoint(event.clientX, event.clientY);
	        // Update the current element reference.
	        this._currentElement = currElem;
	        // Note: drag enter fires *before* drag leave according to spec.
	        // https://html.spec.whatwg.org/multipage/interaction.html#drag-and-drop-processing-model
	        // If the indicated element changes from the previous iteration,
	        // and is different from the current target, dispatch the enter
	        // events and compute the new target element.
	        if (currElem !== prevElem && currElem !== currTarget) {
	            currTarget = dispatchDragEnter(this, currElem, currTarget, event);
	        }
	        // If the current target element has changed, update the current
	        // target reference and dispatch the leave event to the old target.
	        if (currTarget !== prevTarget) {
	            this._currentTarget = currTarget;
	            dispatchDragLeave(this, prevTarget, currTarget, event);
	        }
	        // Dispatch the drag over event and update the drop action.
	        var action = dispatchDragOver(this, currTarget, event);
	        this._setDropAction(action);
	    };
	    /**
	     * Attach the drag image element at the specified location.
	     *
	     * This is a no-op if there is no drag image element.
	     */
	    Drag.prototype._attachDragImage = function (clientX, clientY) {
	        if (!this._dragImage) {
	            return;
	        }
	        this._dragImage.classList.add(DRAG_IMAGE_CLASS);
	        var style = this._dragImage.style;
	        style.pointerEvents = 'none';
	        style.position = 'absolute';
	        style.top = clientY + "px";
	        style.left = clientX + "px";
	        document.body.appendChild(this._dragImage);
	    };
	    /**
	     * Move the drag image element to the specified location.
	     *
	     * This is a no-op if there is no drag image element.
	     */
	    Drag.prototype._moveDragImage = function (clientX, clientY) {
	        if (!this._dragImage) {
	            return;
	        }
	        var style = this._dragImage.style;
	        style.top = clientY + "px";
	        style.left = clientX + "px";
	    };
	    /**
	     * Detach the drag image element from the DOM.
	     *
	     * This is a no-op if there is no drag image element.
	     */
	    Drag.prototype._detachDragImage = function () {
	        if (!this._dragImage) {
	            return;
	        }
	        var parent = this._dragImage.parentNode;
	        if (!parent) {
	            return;
	        }
	        parent.removeChild(this._dragImage);
	    };
	    /**
	     * Set the internal drop action state and update the drag cursor.
	     */
	    Drag.prototype._setDropAction = function (action) {
	        if ((action & this._supportedActions) === 0) {
	            action = DropAction.None;
	        }
	        if (this._override && this._dropAction === action) {
	            return;
	        }
	        switch (action) {
	            case DropAction.None:
	                this._dropAction = action;
	                this._override = phosphor_domutil_1.overrideCursor('no-drop');
	                break;
	            case DropAction.Copy:
	                this._dropAction = action;
	                this._override = phosphor_domutil_1.overrideCursor('copy');
	                break;
	            case DropAction.Link:
	                this._dropAction = action;
	                this._override = phosphor_domutil_1.overrideCursor('alias');
	                break;
	            case DropAction.Move:
	                this._dropAction = action;
	                this._override = phosphor_domutil_1.overrideCursor('move');
	                break;
	        }
	    };
	    /**
	     * Finalize the drag operation and resolve the drag promise.
	     */
	    Drag.prototype._finalize = function (action) {
	        // Store the resolve function as a temp variable.
	        var resolve = this._resolve;
	        // Remove the document event listeners.
	        this._removeListeners();
	        // Detach the drag image.
	        this._detachDragImage();
	        // Dispose of the cursor override.
	        if (this._override)
	            this._override.dispose();
	        // Clear the mime data.
	        if (this._mimeData)
	            this._mimeData.clear();
	        // Clear the internal drag state.
	        this._disposed = true;
	        this._source = null;
	        this._mimeData = null;
	        this._dragImage = null;
	        this._dropAction = DropAction.None;
	        this._proposedAction = DropAction.None;
	        this._supportedActions = DropActions.None;
	        this._override = null;
	        this._currentTarget = null;
	        this._currentElement = null;
	        this._promise = null;
	        this._resolve = null;
	        // Resolve the promise to the given drop action, if possible.
	        if (resolve)
	            resolve(action);
	    };
	    return Drag;
	}());
	exports.Drag = Drag;
	/**
	 * Create a left mouse event at the given position.
	 *
	 * @param type - The event type for the mouse event.
	 *
	 * @param clientX - The client X position.
	 *
	 * @param clientY - The client Y position.
	 *
	 * @returns A newly created and initialized mouse event.
	 */
	function createMouseEvent(type, clientX, clientY) {
	    var event = document.createEvent('MouseEvent');
	    event.initMouseEvent(type, true, true, window, 0, 0, 0, clientX, clientY, false, false, false, false, 0, null);
	    return event;
	}
	/**
	 * Create a new initialized `IDragEvent` from the given data.
	 *
	 * @param type - The event type for the drag event.
	 *
	 * @param drag - The drag object to use for seeding the drag data.
	 *
	 * @param event - The mouse event to use for seeding the mouse data.
	 *
	 * @param related - The related target for the event, or `null`.
	 *
	 * @returns A new object which implements `IDragEvent`.
	 */
	function createDragEvent(type, drag, event, related) {
	    // Create a new mouse event and cast to a custom drag event.
	    var dragEvent = document.createEvent('MouseEvent');
	    // Initialize the mouse event data.
	    dragEvent.initMouseEvent(type, true, true, window, 0, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, related);
	    // Add the custom drag event data.
	    dragEvent.mimeData = drag.mimeData;
	    dragEvent.dropAction = DropAction.None;
	    dragEvent.proposedAction = drag.proposedAction;
	    dragEvent.supportedActions = drag.supportedActions;
	    dragEvent.source = drag.source;
	    // Return the fully initialized drag event.
	    return dragEvent;
	}
	/**
	 * Dispatch a drag enter event to the indicated element.
	 *
	 * @param drag - The drag object associated with the action.
	 *
	 * @param currElem - The currently indicated element, or `null`. This
	 *   is the "immediate user selection" from the whatwg spec.
	 *
	 * @param currTarget - The current drag target element, or `null`. This
	 *   is the "current target element" from the whatwg spec.
	 *
	 * @param event - The mouse event related to the action.
	 *
	 * @returns The element to use as the current drag target. This is the
	 *   "current target element" from the whatwg spec, and may be `null`.
	 *
	 * #### Notes
	 * This largely implements the drag enter portion of the whatwg spec:
	 * https://html.spec.whatwg.org/multipage/interaction.html#drag-and-drop-processing-model
	 */
	function dispatchDragEnter(drag, currElem, currTarget, event) {
	    // If the current element is null, return null as the new target.
	    if (!currElem) {
	        return null;
	    }
	    // Dispatch a drag enter event to the current element.
	    var dragEvent = createDragEvent('p-dragenter', drag, event, currTarget);
	    var canceled = !currElem.dispatchEvent(dragEvent);
	    // If the event was canceled, use the current element as the new target.
	    if (canceled) {
	        return currElem;
	    }
	    // If the current element is the document body, keep the original target.
	    if (currElem === document.body) {
	        return currTarget;
	    }
	    // Dispatch a drag enter event on the document body.
	    dragEvent = createDragEvent('p-dragenter', drag, event, currTarget);
	    document.body.dispatchEvent(dragEvent);
	    // Ignore the event cancellation, and use the body as the new target.
	    return document.body;
	}
	/**
	 * Dispatch a drag leave event to the indicated element.
	 *
	 * @param drag - The drag object associated with the action.
	 *
	 * @param prevTarget - The previous target element, or `null`. This
	 *   is the previous "current target element" from the whatwg spec.
	 *
	 * @param currTarget - The current drag target element, or `null`. This
	 *   is the "current target element" from the whatwg spec.
	 *
	 * @param event - The mouse event related to the action.
	 *
	 * #### Notes
	 * This largely implements the drag leave portion of the whatwg spec:
	 * https://html.spec.whatwg.org/multipage/interaction.html#drag-and-drop-processing-model
	 */
	function dispatchDragLeave(drag, prevTarget, currTarget, event) {
	    // If the previous target is null, do nothing.
	    if (!prevTarget) {
	        return;
	    }
	    // Dispatch the drag leave event to the previous target.
	    var dragEvent = createDragEvent('p-dragleave', drag, event, currTarget);
	    prevTarget.dispatchEvent(dragEvent);
	}
	/**
	 * Dispatch a drag over event to the indicated element.
	 *
	 * @param drag - The drag object associated with the action.
	 *
	 * @param currTarget - The current drag target element, or `null`. This
	 *   is the "current target element" from the whatwg spec.
	 *
	 * @param event - The mouse event related to the action.
	 *
	 * @returns The `DropAction` result of the drag over event.
	 *
	 * #### Notes
	 * This largely implements the drag over portion of the whatwg spec:
	 * https://html.spec.whatwg.org/multipage/interaction.html#drag-and-drop-processing-model
	 */
	function dispatchDragOver(drag, currTarget, event) {
	    // If there is no current target, the drop action is none.
	    if (!currTarget) {
	        return DropAction.None;
	    }
	    // Dispatch the drag over event to the current target.
	    var dragEvent = createDragEvent('p-dragover', drag, event, null);
	    var canceled = !currTarget.dispatchEvent(dragEvent);
	    // If the event was canceled, return the drop action result.
	    if (canceled) {
	        return dragEvent.dropAction;
	    }
	    // Otherwise, the effective drop action is none.
	    return DropAction.None;
	}
	/**
	 * Dispatch a drop event to the indicated element.
	 *
	 * @param drag - The drag object associated with the action.
	 *
	 * @param currTarget - The current drag target element, or `null`. This
	 *   is the "current target element" from the whatwg spec.
	 *
	 * @param event - The mouse event related to the action.
	 *
	 * @returns The `DropAction` result of the drop event.
	 *
	 * #### Notes
	 * This largely implements the drag over portion of the whatwg spec:
	 * https://html.spec.whatwg.org/multipage/interaction.html#drag-and-drop-processing-model
	 */
	function dispatchDrop(drag, currTarget, event) {
	    // If there is no current target, the drop action is none.
	    if (!currTarget) {
	        return DropAction.None;
	    }
	    // Dispatch the drop event to the current target.
	    var dragEvent = createDragEvent('p-drop', drag, event, null);
	    var canceled = !currTarget.dispatchEvent(dragEvent);
	    // If the event was canceled, return the drop action result.
	    if (canceled) {
	        return dragEvent.dropAction;
	    }
	    // Otherwise, the effective drop action is none.
	    return DropAction.None;
	}


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(33));
	__export(__webpack_require__(34));
	__webpack_require__(35);


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var arrays = __webpack_require__(3);
	var phosphor_boxengine_1 = __webpack_require__(6);
	var phosphor_domutil_1 = __webpack_require__(7);
	var phosphor_messaging_1 = __webpack_require__(13);
	var phosphor_panel_1 = __webpack_require__(18);
	var phosphor_properties_1 = __webpack_require__(17);
	var phosphor_widget_1 = __webpack_require__(20);
	/**
	 * The class name added to hidden split handles.
	 */
	var HIDDEN_CLASS = 'p-mod-hidden';
	/**
	 * The class name added to horizontal split panels.
	 */
	var HORIZONTAL_CLASS = 'p-mod-horizontal';
	/**
	 * The class name added to vertical split panels.
	 */
	var VERTICAL_CLASS = 'p-mod-vertical';
	/**
	 * The orientation of a split layout.
	 */
	(function (Orientation) {
	    /**
	     * Left-to-right horizontal orientation.
	     */
	    Orientation[Orientation["Horizontal"] = 0] = "Horizontal";
	    /**
	     * Top-to-bottom vertical orientation.
	     */
	    Orientation[Orientation["Vertical"] = 1] = "Vertical";
	})(exports.Orientation || (exports.Orientation = {}));
	var Orientation = exports.Orientation;
	/**
	 * A layout which arranges its children into resizable sections.
	 */
	var SplitLayout = (function (_super) {
	    __extends(SplitLayout, _super);
	    /**
	     * Construct a new split layout.
	     *
	     * @param factory - The handle factory for creating split handles.
	     */
	    function SplitLayout(factory) {
	        _super.call(this);
	        this._fixed = 0;
	        this._spacing = 3;
	        this._normed = false;
	        this._box = null;
	        this._sizers = [];
	        this._handles = [];
	        this._orientation = Orientation.Horizontal;
	        this._factory = factory;
	    }
	    Object.defineProperty(SplitLayout.prototype, "orientation", {
	        /**
	         * Get the layout orientation for the split layout.
	         */
	        get: function () {
	            return this._orientation;
	        },
	        /**
	         * Set the layout orientation for the split layout.
	         */
	        set: function (value) {
	            if (this._orientation === value) {
	                return;
	            }
	            this._orientation = value;
	            if (!this.parent) {
	                return;
	            }
	            SplitLayoutPrivate.toggleOrientation(this.parent, value);
	            this.parent.fit();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SplitLayout.prototype, "spacing", {
	        /**
	         * Get the inter-element spacing for the split layout.
	         */
	        get: function () {
	            return this._spacing;
	        },
	        /**
	         * Set the inter-element spacing for the split layout.
	         */
	        set: function (value) {
	            value = Math.max(0, value | 0);
	            if (this._spacing === value) {
	                return;
	            }
	            this._spacing = value;
	            if (!this.parent) {
	                return;
	            }
	            this.parent.fit();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Get the normalized sizes of the widgets in the layout.
	     *
	     * @returns The normalized sizes of the widgets in the layout.
	     */
	    SplitLayout.prototype.sizes = function () {
	        return SplitLayoutPrivate.normalize(this._sizers.map(function (s) { return s.size; }));
	    };
	    /**
	     * Set the relative sizes for the child widgets in the layout.
	     *
	     * @param sizes - The relative sizes for the children in the layout.
	     *   These values will be normalized to the available layout space.
	     *
	     * #### Notes
	     * Extra values are ignored, too few will yield an undefined layout.
	     */
	    SplitLayout.prototype.setSizes = function (sizes) {
	        var normed = SplitLayoutPrivate.normalize(sizes);
	        for (var i = 0, n = this._sizers.length; i < n; ++i) {
	            var hint = Math.max(0, normed[i] || 0);
	            var sizer = this._sizers[i];
	            sizer.sizeHint = hint;
	            sizer.size = hint;
	        }
	        this._normed = true;
	        if (this.parent)
	            this.parent.update();
	    };
	    /**
	     * Get the handle for the widget at the given index.
	     *
	     * @param index - The index of the handle of interest.
	     *
	     * @returns The handle for the given index, or `undefined`.
	     */
	    SplitLayout.prototype.handleAt = function (index) {
	        return this._handles[index];
	    };
	    /**
	     * Move a split handle to the specified offset position.
	     *
	     * @param index - The index of the handle of the interest.
	     *
	     * @param position - The desired offset position of the handle. This
	     *   is the absolute position relative to the origin of the parent.
	     *
	     * #### Notes
	     * This will move the handle as close as possible to the desired
	     * position. The sibling children will be adjusted as necessary.
	     */
	    SplitLayout.prototype.moveHandle = function (index, position) {
	        // Bail if the index is invalid or the handle is hidden.
	        var handle = this._handles[index];
	        if (!handle || handle.classList.contains(HIDDEN_CLASS)) {
	            return;
	        }
	        // Compute the delta movement for the handle.
	        var delta;
	        if (this._orientation === Orientation.Horizontal) {
	            delta = position - handle.offsetLeft;
	        }
	        else {
	            delta = position - handle.offsetTop;
	        }
	        // Bail if there is no handle movement.
	        if (delta === 0) {
	            return;
	        }
	        // Prevent item resizing unless needed.
	        for (var _i = 0, _a = this._sizers; _i < _a.length; _i++) {
	            var sizer = _a[_i];
	            if (sizer.size > 0)
	                sizer.sizeHint = sizer.size;
	        }
	        // Adjust the sizers to reflect the movement.
	        if (delta > 0) {
	            SplitLayoutPrivate.growSizer(this._sizers, index, delta);
	        }
	        else {
	            SplitLayoutPrivate.shrinkSizer(this._sizers, index, -delta);
	        }
	        // Update the layout of the child widgets.
	        if (this.parent)
	            this.parent.update();
	    };
	    /**
	     * Initialize the children of the layout.
	     *
	     * #### Notes
	     * This method is called automatically when the layout is installed
	     * on its parent widget.
	     */
	    SplitLayout.prototype.initialize = function () {
	        SplitLayoutPrivate.toggleOrientation(this.parent, this.orientation);
	        _super.prototype.initialize.call(this);
	    };
	    /**
	     * Attach a child widget to the parent's DOM node.
	     *
	     * @param index - The current index of the child in the layout.
	     *
	     * @param child - The child widget to attach to the parent.
	     *
	     * #### Notes
	     * This is a reimplementation of the superclass method.
	     */
	    SplitLayout.prototype.attachChild = function (index, child) {
	        var handle = SplitLayoutPrivate.createHandle(this._factory);
	        var average = SplitLayoutPrivate.averageSize(this._sizers);
	        var sizer = SplitLayoutPrivate.createSizer(average);
	        arrays.insert(this._sizers, index, sizer);
	        arrays.insert(this._handles, index, handle);
	        SplitLayoutPrivate.prepareGeometry(child);
	        this.parent.node.appendChild(child.node);
	        this.parent.node.appendChild(handle);
	        if (this.parent.isAttached)
	            phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgAfterAttach);
	        this.parent.fit();
	    };
	    /**
	     * Move a child widget in the parent's DOM node.
	     *
	     * @param fromIndex - The previous index of the child in the layout.
	     *
	     * @param toIndex - The current index of the child in the layout.
	     *
	     * @param child - The child widget to move in the parent.
	     *
	     * #### Notes
	     * This is a reimplementation of the superclass method.
	     */
	    SplitLayout.prototype.moveChild = function (fromIndex, toIndex, child) {
	        arrays.move(this._sizers, fromIndex, toIndex);
	        arrays.move(this._handles, fromIndex, toIndex);
	        this.parent.fit(); // fit instead of update to show/hide handles
	    };
	    /**
	     * Detach a child widget from the parent's DOM node.
	     *
	     * @param index - The previous index of the child in the layout.
	     *
	     * @param child - The child widget to detach from the parent.
	     *
	     * #### Notes
	     * This is a reimplementation of the superclass method.
	     */
	    SplitLayout.prototype.detachChild = function (index, child) {
	        var sizer = arrays.removeAt(this._sizers, index);
	        var handle = arrays.removeAt(this._handles, index);
	        if (this.parent.isAttached)
	            phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgBeforeDetach);
	        this.parent.node.removeChild(child.node);
	        this.parent.node.removeChild(handle);
	        SplitLayoutPrivate.resetGeometry(child);
	        this.parent.fit();
	    };
	    /**
	     * A message handler invoked on an `'after-show'` message.
	     */
	    SplitLayout.prototype.onAfterShow = function (msg) {
	        _super.prototype.onAfterShow.call(this, msg);
	        this.parent.update();
	    };
	    /**
	     * A message handler invoked on an `'after-attach'` message.
	     */
	    SplitLayout.prototype.onAfterAttach = function (msg) {
	        _super.prototype.onAfterAttach.call(this, msg);
	        this.parent.fit();
	    };
	    /**
	     * A message handler invoked on a `'child-shown'` message.
	     */
	    SplitLayout.prototype.onChildShown = function (msg) {
	        if (SplitLayoutPrivate.IsIE) {
	            phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgFitRequest);
	        }
	        else {
	            this.parent.fit();
	        }
	    };
	    /**
	     * A message handler invoked on a `'child-hidden'` message.
	     */
	    SplitLayout.prototype.onChildHidden = function (msg) {
	        if (SplitLayoutPrivate.IsIE) {
	            phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgFitRequest);
	        }
	        else {
	            this.parent.fit();
	        }
	    };
	    /**
	     * A message handler invoked on a `'resize'` message.
	     */
	    SplitLayout.prototype.onResize = function (msg) {
	        if (this.parent.isVisible) {
	            this._update(msg.width, msg.height);
	        }
	    };
	    /**
	     * A message handler invoked on an `'update-request'` message.
	     */
	    SplitLayout.prototype.onUpdateRequest = function (msg) {
	        if (this.parent.isVisible) {
	            this._update(-1, -1);
	        }
	    };
	    /**
	     * A message handler invoked on a `'fit-request'` message.
	     */
	    SplitLayout.prototype.onFitRequest = function (msg) {
	        if (this.parent.isAttached) {
	            this._fit();
	        }
	    };
	    /**
	     * Fit the layout to the total size required by the child widgets.
	     */
	    SplitLayout.prototype._fit = function () {
	        // Update the handles and track the visible widget count.
	        var nVisible = 0;
	        var lastHandle = null;
	        for (var i = 0, n = this.childCount(); i < n; ++i) {
	            var handle = this._handles[i];
	            if (this.childAt(i).isHidden) {
	                handle.classList.add(HIDDEN_CLASS);
	            }
	            else {
	                handle.classList.remove(HIDDEN_CLASS);
	                lastHandle = handle;
	                nVisible++;
	            }
	        }
	        // Hide the handle for the last visible child.
	        if (lastHandle)
	            lastHandle.classList.add(HIDDEN_CLASS);
	        // Update the fixed space for the visible items.
	        this._fixed = this._spacing * Math.max(0, nVisible - 1);
	        // Setup the initial size limits.
	        var minW = 0;
	        var minH = 0;
	        var maxW = Infinity;
	        var maxH = Infinity;
	        var horz = this._orientation === Orientation.Horizontal;
	        if (horz) {
	            minW = this._fixed;
	            maxW = nVisible > 0 ? minW : maxW;
	        }
	        else {
	            minH = this._fixed;
	            maxH = nVisible > 0 ? minH : maxH;
	        }
	        // Update the sizers and computed size limits.
	        for (var i = 0, n = this.childCount(); i < n; ++i) {
	            var child = this.childAt(i);
	            var sizer = this._sizers[i];
	            if (sizer.size > 0) {
	                sizer.sizeHint = sizer.size;
	            }
	            if (child.isHidden) {
	                sizer.minSize = 0;
	                sizer.maxSize = 0;
	                continue;
	            }
	            var limits = phosphor_domutil_1.sizeLimits(child.node);
	            sizer.stretch = SplitLayout.getStretch(child);
	            if (horz) {
	                sizer.minSize = limits.minWidth;
	                sizer.maxSize = limits.maxWidth;
	                minW += limits.minWidth;
	                maxW += limits.maxWidth;
	                minH = Math.max(minH, limits.minHeight);
	                maxH = Math.min(maxH, limits.maxHeight);
	            }
	            else {
	                sizer.minSize = limits.minHeight;
	                sizer.maxSize = limits.maxHeight;
	                minH += limits.minHeight;
	                maxH += limits.maxHeight;
	                minW = Math.max(minW, limits.minWidth);
	                maxW = Math.min(maxW, limits.maxWidth);
	            }
	        }
	        // Update the box sizing and add it to the size constraints.
	        var box = this._box = phosphor_domutil_1.boxSizing(this.parent.node);
	        minW += box.horizontalSum;
	        minH += box.verticalSum;
	        maxW += box.horizontalSum;
	        maxH += box.verticalSum;
	        // Update the parent's size constraints.
	        var style = this.parent.node.style;
	        style.minWidth = minW + "px";
	        style.minHeight = minH + "px";
	        style.maxWidth = maxW === Infinity ? 'none' : maxW + "px";
	        style.maxHeight = maxH === Infinity ? 'none' : maxH + "px";
	        // Notify the ancestor that it should fit immediately.
	        var ancestor = this.parent.parent;
	        if (ancestor)
	            phosphor_messaging_1.sendMessage(ancestor, phosphor_widget_1.Widget.MsgFitRequest);
	        // Notify the parent that it should update immediately.
	        phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgUpdateRequest);
	    };
	    /**
	     * Update the layout position and size of the child widgets.
	     *
	     * The parent offset dimensions should be `-1` if unknown.
	     */
	    SplitLayout.prototype._update = function (offsetWidth, offsetHeight) {
	        // Bail early if there are no children to layout.
	        if (this.childCount() === 0) {
	            return;
	        }
	        // Measure the parent if the offset dimensions are unknown.
	        if (offsetWidth < 0) {
	            offsetWidth = this.parent.node.offsetWidth;
	        }
	        if (offsetHeight < 0) {
	            offsetHeight = this.parent.node.offsetHeight;
	        }
	        // Ensure the parent box sizing data is computed.
	        var box = this._box || (this._box = phosphor_domutil_1.boxSizing(this.parent.node));
	        // Compute the actual layout bounds adjusted for border and padding.
	        var top = box.paddingTop;
	        var left = box.paddingLeft;
	        var width = offsetWidth - box.horizontalSum;
	        var height = offsetHeight - box.verticalSum;
	        // Compute the adjusted layout space.
	        var space;
	        var horz = this._orientation === Orientation.Horizontal;
	        if (horz) {
	            space = Math.max(0, width - this._fixed);
	        }
	        else {
	            space = Math.max(0, height - this._fixed);
	        }
	        // Scale the size hints if they are normalized.
	        if (this._normed) {
	            for (var _i = 0, _a = this._sizers; _i < _a.length; _i++) {
	                var sizer = _a[_i];
	                sizer.sizeHint *= space;
	            }
	            this._normed = false;
	        }
	        // Distribute the layout space to the box sizers.
	        phosphor_boxengine_1.boxCalc(this._sizers, space);
	        // Layout the children using the computed box sizes.
	        var spacing = this._spacing;
	        for (var i = 0, n = this.childCount(); i < n; ++i) {
	            var child = this.childAt(i);
	            if (child.isHidden) {
	                continue;
	            }
	            var handle = this._handles[i];
	            var size = this._sizers[i].size;
	            if (horz) {
	                SplitLayoutPrivate.setGeometry(child, left, top, size, height);
	                left += size;
	                SplitLayoutPrivate.setHandleGeo(handle, left, top, spacing, height);
	                left += spacing;
	            }
	            else {
	                SplitLayoutPrivate.setGeometry(child, left, top, width, size);
	                top += size;
	                SplitLayoutPrivate.setHandleGeo(handle, left, top, width, spacing);
	                top += spacing;
	            }
	        }
	    };
	    return SplitLayout;
	})(phosphor_panel_1.PanelLayout);
	exports.SplitLayout = SplitLayout;
	/**
	 * The namespace for the `SplitLayout` class statics.
	 */
	var SplitLayout;
	(function (SplitLayout) {
	    /**
	     * A convenience alias of the `Horizontal` [[Orientation]].
	     */
	    SplitLayout.Horizontal = Orientation.Horizontal;
	    /**
	     * A convenience alias of the `Vertical` [[Orientation]].
	     */
	    SplitLayout.Vertical = Orientation.Vertical;
	    /**
	     * Get the split layout stretch factor for the given widget.
	     *
	     * @param widget - The widget of interest.
	     *
	     * @returns The split layout stretch factor for the widget.
	     */
	    function getStretch(widget) {
	        return SplitLayoutPrivate.stretchProperty.get(widget);
	    }
	    SplitLayout.getStretch = getStretch;
	    /**
	     * Set the split layout stretch factor for the given widget.
	     *
	     * @param widget - The widget of interest.
	     *
	     * @param value - The value for the stretch factor.
	     */
	    function setStretch(widget, value) {
	        SplitLayoutPrivate.stretchProperty.set(widget, value);
	    }
	    SplitLayout.setStretch = setStretch;
	})(SplitLayout = exports.SplitLayout || (exports.SplitLayout = {}));
	/**
	 * The namespace for the `SplitLayout` class private data.
	 */
	var SplitLayoutPrivate;
	(function (SplitLayoutPrivate) {
	    /**
	     * A flag indicating whether the browser is IE.
	     */
	    SplitLayoutPrivate.IsIE = /Trident/.test(navigator.userAgent);
	    /**
	     * The property descriptor for a widget stretch factor.
	     */
	    SplitLayoutPrivate.stretchProperty = new phosphor_properties_1.Property({
	        name: 'stretch',
	        value: 0,
	        coerce: function (owner, value) { return Math.max(0, value | 0); },
	        changed: onChildPropertyChanged,
	    });
	    /**
	     * Create a new box sizer with the given size hint.
	     */
	    function createSizer(size) {
	        var sizer = new phosphor_boxengine_1.BoxSizer();
	        sizer.sizeHint = size | 0;
	        return sizer;
	    }
	    SplitLayoutPrivate.createSizer = createSizer;
	    /**
	     * Create a new split handle using the given factory.
	     */
	    function createHandle(factory) {
	        var handle = factory.createHandle();
	        handle.style.position = 'absolute';
	        return handle;
	    }
	    SplitLayoutPrivate.createHandle = createHandle;
	    /**
	     * Toggle the CSS orientation class for the given widget.
	     */
	    function toggleOrientation(widget, orient) {
	        widget.toggleClass(HORIZONTAL_CLASS, orient === Orientation.Horizontal);
	        widget.toggleClass(VERTICAL_CLASS, orient === Orientation.Vertical);
	    }
	    SplitLayoutPrivate.toggleOrientation = toggleOrientation;
	    /**
	     * Prepare the layout geometry for the given child widget.
	     */
	    function prepareGeometry(widget) {
	        widget.node.style.position = 'absolute';
	    }
	    SplitLayoutPrivate.prepareGeometry = prepareGeometry;
	    /**
	     * Reset the layout geometry for the given child widget.
	     */
	    function resetGeometry(widget) {
	        var rect = rectProperty.get(widget);
	        var style = widget.node.style;
	        rect.top = NaN;
	        rect.left = NaN;
	        rect.width = NaN;
	        rect.height = NaN;
	        style.position = '';
	        style.top = '';
	        style.left = '';
	        style.width = '';
	        style.height = '';
	    }
	    SplitLayoutPrivate.resetGeometry = resetGeometry;
	    /**
	     * Set the layout geometry of a child widget.
	     */
	    function setGeometry(widget, left, top, width, height) {
	        var resized = false;
	        var style = widget.node.style;
	        var rect = rectProperty.get(widget);
	        if (rect.top !== top) {
	            rect.top = top;
	            style.top = top + "px";
	        }
	        if (rect.left !== left) {
	            rect.left = left;
	            style.left = left + "px";
	        }
	        if (rect.width !== width) {
	            resized = true;
	            rect.width = width;
	            style.width = width + "px";
	        }
	        if (rect.height !== height) {
	            resized = true;
	            rect.height = height;
	            style.height = height + "px";
	        }
	        if (resized) {
	            phosphor_messaging_1.sendMessage(widget, new phosphor_widget_1.ResizeMessage(width, height));
	        }
	    }
	    SplitLayoutPrivate.setGeometry = setGeometry;
	    /**
	     * Set the layout geometry of a split handle.
	     */
	    function setHandleGeo(handle, left, top, width, height) {
	        var style = handle.style;
	        style.top = top + "px";
	        style.left = left + "px";
	        style.width = width + "px";
	        style.height = height + "px";
	    }
	    SplitLayoutPrivate.setHandleGeo = setHandleGeo;
	    /**
	     * Compute the average size of the given box sizers.
	     */
	    function averageSize(sizers) {
	        if (sizers.length === 0)
	            return 0;
	        return sizers.reduce(function (v, s) { return v + s.size; }, 0) / sizers.length;
	    }
	    SplitLayoutPrivate.averageSize = averageSize;
	    /**
	     * Normalize an array of positive values.
	     */
	    function normalize(values) {
	        var n = values.length;
	        if (n === 0) {
	            return [];
	        }
	        var sum = 0;
	        for (var i = 0; i < n; ++i) {
	            sum += values[i];
	        }
	        var result = new Array(n);
	        if (sum === 0) {
	            for (var i = 0; i < n; ++i) {
	                result[i] = 1 / n;
	            }
	        }
	        else {
	            for (var i = 0; i < n; ++i) {
	                result[i] = values[i] / sum;
	            }
	        }
	        return result;
	    }
	    SplitLayoutPrivate.normalize = normalize;
	    /**
	     * Grow a sizer to the right by a positive delta and adjust neighbors.
	     */
	    function growSizer(sizers, index, delta) {
	        var growLimit = 0;
	        for (var i = 0; i <= index; ++i) {
	            var sizer = sizers[i];
	            growLimit += sizer.maxSize - sizer.size;
	        }
	        var shrinkLimit = 0;
	        for (var i = index + 1, n = sizers.length; i < n; ++i) {
	            var sizer = sizers[i];
	            shrinkLimit += sizer.size - sizer.minSize;
	        }
	        delta = Math.min(delta, growLimit, shrinkLimit);
	        var grow = delta;
	        for (var i = index; i >= 0 && grow > 0; --i) {
	            var sizer = sizers[i];
	            var limit = sizer.maxSize - sizer.size;
	            if (limit >= grow) {
	                sizer.sizeHint = sizer.size + grow;
	                grow = 0;
	            }
	            else {
	                sizer.sizeHint = sizer.size + limit;
	                grow -= limit;
	            }
	        }
	        var shrink = delta;
	        for (var i = index + 1, n = sizers.length; i < n && shrink > 0; ++i) {
	            var sizer = sizers[i];
	            var limit = sizer.size - sizer.minSize;
	            if (limit >= shrink) {
	                sizer.sizeHint = sizer.size - shrink;
	                shrink = 0;
	            }
	            else {
	                sizer.sizeHint = sizer.size - limit;
	                shrink -= limit;
	            }
	        }
	    }
	    SplitLayoutPrivate.growSizer = growSizer;
	    /**
	     * Shrink a sizer to the left by a positive delta and adjust neighbors.
	     */
	    function shrinkSizer(sizers, index, delta) {
	        var growLimit = 0;
	        for (var i = index + 1, n = sizers.length; i < n; ++i) {
	            var sizer = sizers[i];
	            growLimit += sizer.maxSize - sizer.size;
	        }
	        var shrinkLimit = 0;
	        for (var i = 0; i <= index; ++i) {
	            var sizer = sizers[i];
	            shrinkLimit += sizer.size - sizer.minSize;
	        }
	        delta = Math.min(delta, growLimit, shrinkLimit);
	        var grow = delta;
	        for (var i = index + 1, n = sizers.length; i < n && grow > 0; ++i) {
	            var sizer = sizers[i];
	            var limit = sizer.maxSize - sizer.size;
	            if (limit >= grow) {
	                sizer.sizeHint = sizer.size + grow;
	                grow = 0;
	            }
	            else {
	                sizer.sizeHint = sizer.size + limit;
	                grow -= limit;
	            }
	        }
	        var shrink = delta;
	        for (var i = index; i >= 0 && shrink > 0; --i) {
	            var sizer = sizers[i];
	            var limit = sizer.size - sizer.minSize;
	            if (limit >= shrink) {
	                sizer.sizeHint = sizer.size - shrink;
	                shrink = 0;
	            }
	            else {
	                sizer.sizeHint = sizer.size - limit;
	                shrink -= limit;
	            }
	        }
	    }
	    SplitLayoutPrivate.shrinkSizer = shrinkSizer;
	    /**
	     * A property descriptor for a widget offset rect.
	     */
	    var rectProperty = new phosphor_properties_1.Property({
	        name: 'rect',
	        create: function () { return ({ top: NaN, left: NaN, width: NaN, height: NaN }); },
	    });
	    /**
	     * The change handler for the attached child properties.
	     */
	    function onChildPropertyChanged(child) {
	        var parent = child.parent;
	        var layout = parent && parent.layout;
	        if (layout instanceof SplitLayout)
	            parent.fit();
	    }
	})(SplitLayoutPrivate || (SplitLayoutPrivate = {}));


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var phosphor_domutil_1 = __webpack_require__(7);
	var phosphor_panel_1 = __webpack_require__(18);
	var layout_1 = __webpack_require__(33);
	/**
	 * The class name added to SplitPanel instances.
	 */
	var SPLIT_PANEL_CLASS = 'p-SplitPanel';
	/**
	 * The class name added to split panel children.
	 */
	var CHILD_CLASS = 'p-SplitPanel-child';
	/**
	 * The class name added to split panel handles.
	 */
	var HANDLE_CLASS = 'p-SplitPanel-handle';
	/**
	 * A panel which arranges its children into resizable sections.
	 *
	 * #### Notes
	 * This class provides a convenience wrapper around a [[SplitLayout]].
	 */
	var SplitPanel = (function (_super) {
	    __extends(SplitPanel, _super);
	    /**
	     * Construct a new split panel.
	     */
	    function SplitPanel() {
	        _super.call(this);
	        this._pressData = null;
	        this.addClass(SPLIT_PANEL_CLASS);
	    }
	    /**
	     * Create a split layout for a split panel.
	     */
	    SplitPanel.createLayout = function () {
	        return new layout_1.SplitLayout(this);
	    };
	    /**
	     * Create a split handle for use in a split panel.
	     *
	     * #### Notes
	     * This may be reimplemented to create custom split handles.
	     */
	    SplitPanel.createHandle = function () {
	        var handle = document.createElement('div');
	        handle.className = HANDLE_CLASS;
	        return handle;
	    };
	    /**
	     * Dispose of the resources held by the panel.
	     */
	    SplitPanel.prototype.dispose = function () {
	        this._releaseMouse();
	        _super.prototype.dispose.call(this);
	    };
	    Object.defineProperty(SplitPanel.prototype, "orientation", {
	        /**
	         * Get the layout orientation for the split panel.
	         */
	        get: function () {
	            return this.layout.orientation;
	        },
	        /**
	         * Set the layout orientation for the split panel.
	         */
	        set: function (value) {
	            this.layout.orientation = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SplitPanel.prototype, "spacing", {
	        /**
	         * Get the inter-element spacing for the split panel.
	         */
	        get: function () {
	            return this.layout.spacing;
	        },
	        /**
	         * Set the inter-element spacing for the split panel.
	         */
	        set: function (value) {
	            this.layout.spacing = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Get the normalized sizes of the widgets in the panel.
	     *
	     * @returns The normalized sizes of the widgets in the panel.
	     */
	    SplitPanel.prototype.sizes = function () {
	        return this.layout.sizes();
	    };
	    /**
	     * Set the relative sizes for the child widgets in the panel.
	     *
	     * @param sizes - The relative sizes for the children in the panel.
	     *   These values will be normalized to the available layout space.
	     *
	     * #### Notes
	     * Extra values are ignored, too few will yield an undefined layout.
	     */
	    SplitPanel.prototype.setSizes = function (sizes) {
	        this.layout.setSizes(sizes);
	    };
	    /**
	     * Get the split handle for the widget at the given index.
	     *
	     * @param index - The index of the widget of interest.
	     *
	     * @returns The split handle for the widget, or `undefined`.
	     */
	    SplitPanel.prototype.handleAt = function (index) {
	        return this.layout.handleAt(index);
	    };
	    /**
	     * Handle the DOM events for the split panel.
	     *
	     * @param event - The DOM event sent to the panel.
	     *
	     * #### Notes
	     * This method implements the DOM `EventListener` interface and is
	     * called in response to events on the panel's DOM node. It should
	     * not be called directly by user code.
	     */
	    SplitPanel.prototype.handleEvent = function (event) {
	        switch (event.type) {
	            case 'mousedown':
	                this._evtMouseDown(event);
	                break;
	            case 'mousemove':
	                this._evtMouseMove(event);
	                break;
	            case 'mouseup':
	                this._evtMouseUp(event);
	                break;
	            case 'keydown':
	                this._evtKeyDown(event);
	                break;
	            case 'keyup':
	            case 'keypress':
	            case 'contextmenu':
	                // Stop all input events during drag.
	                event.preventDefault();
	                event.stopPropagation();
	                break;
	        }
	    };
	    /**
	     * A message handler invoked on an `'after-attach'` message.
	     */
	    SplitPanel.prototype.onAfterAttach = function (msg) {
	        this.node.addEventListener('mousedown', this);
	    };
	    /**
	     * A message handler invoked on a `'before-detach'` message.
	     */
	    SplitPanel.prototype.onBeforeDetach = function (msg) {
	        this.node.removeEventListener('mousedown', this);
	        this._releaseMouse();
	    };
	    /**
	     * A message handler invoked on a `'child-added'` message.
	     */
	    SplitPanel.prototype.onChildAdded = function (msg) {
	        msg.child.addClass(CHILD_CLASS);
	        this._releaseMouse();
	    };
	    /**
	     * A message handler invoked on a `'child-removed'` message.
	     */
	    SplitPanel.prototype.onChildRemoved = function (msg) {
	        msg.child.removeClass(CHILD_CLASS);
	        this._releaseMouse();
	    };
	    /**
	     * Handle the `'keydown'` event for the split panel.
	     */
	    SplitPanel.prototype._evtKeyDown = function (event) {
	        // Stop all input events during drag.
	        event.preventDefault();
	        event.stopPropagation();
	        // Release the mouse if `Escape` is pressed.
	        if (event.keyCode === 27)
	            this._releaseMouse();
	    };
	    /**
	     * Handle the `'mousedown'` event for the split panel.
	     */
	    SplitPanel.prototype._evtMouseDown = function (event) {
	        // Do nothing if the left mouse button is not pressed.
	        if (event.button !== 0) {
	            return;
	        }
	        // Find the handle which contains the target, if any.
	        var layout = this.layout;
	        var target = event.target;
	        var _a = SplitPanelPrivate.findHandle(layout, target), index = _a.index, handle = _a.handle;
	        if (index === -1) {
	            return;
	        }
	        // Stop the event when a split handle is pressed.
	        event.preventDefault();
	        event.stopPropagation();
	        // Add the extra document listeners.
	        document.addEventListener('mouseup', this, true);
	        document.addEventListener('mousemove', this, true);
	        document.addEventListener('keydown', this, true);
	        document.addEventListener('keyup', this, true);
	        document.addEventListener('keypress', this, true);
	        document.addEventListener('contextmenu', this, true);
	        // Compute the offset delta for the handle press.
	        var delta;
	        var rect = handle.getBoundingClientRect();
	        if (layout.orientation === layout_1.Orientation.Horizontal) {
	            delta = event.clientX - rect.left;
	        }
	        else {
	            delta = event.clientY - rect.top;
	        }
	        // Override the cursor and store the press data.
	        var style = window.getComputedStyle(handle);
	        var override = phosphor_domutil_1.overrideCursor(style.cursor);
	        this._pressData = { index: index, delta: delta, override: override };
	    };
	    /**
	     * Handle the `'mousemove'` event for the split panel.
	     */
	    SplitPanel.prototype._evtMouseMove = function (event) {
	        // Stop the event when dragging a split handle.
	        event.preventDefault();
	        event.stopPropagation();
	        // Compute the desired offset position for the handle.
	        var pos;
	        var layout = this.layout;
	        var rect = this.node.getBoundingClientRect();
	        if (layout.orientation === layout_1.Orientation.Horizontal) {
	            pos = event.clientX - rect.left - this._pressData.delta;
	        }
	        else {
	            pos = event.clientY - rect.top - this._pressData.delta;
	        }
	        // Move the handle as close to the desired position as possible.
	        layout.moveHandle(this._pressData.index, pos);
	    };
	    /**
	     * Handle the `'mouseup'` event for the split panel.
	     */
	    SplitPanel.prototype._evtMouseUp = function (event) {
	        // Do nothing if the left mouse button is not released.
	        if (event.button !== 0) {
	            return;
	        }
	        // Stop the event when releasing a handle.
	        event.preventDefault();
	        event.stopPropagation();
	        // Finalize the mouse release.
	        this._releaseMouse();
	    };
	    /**
	     * Release the mouse grab for the split panel.
	     */
	    SplitPanel.prototype._releaseMouse = function () {
	        // Bail early if no drag is in progress.
	        if (!this._pressData) {
	            return;
	        }
	        // Clear the override cursor.
	        this._pressData.override.dispose();
	        this._pressData = null;
	        // Remove the extra document listeners.
	        document.removeEventListener('mouseup', this, true);
	        document.removeEventListener('mousemove', this, true);
	        document.removeEventListener('keydown', this, true);
	        document.removeEventListener('keyup', this, true);
	        document.removeEventListener('keypress', this, true);
	        document.removeEventListener('contextmenu', this, true);
	    };
	    return SplitPanel;
	})(phosphor_panel_1.Panel);
	exports.SplitPanel = SplitPanel;
	/**
	 * The namespace for the `SplitPanel` class statics.
	 */
	var SplitPanel;
	(function (SplitPanel) {
	    /**
	     * A convenience alias of the `Horizontal` [[Orientation]].
	     */
	    SplitPanel.Horizontal = layout_1.Orientation.Horizontal;
	    /**
	     * A convenience alias of the `Vertical` [[Orientation]].
	     */
	    SplitPanel.Vertical = layout_1.Orientation.Vertical;
	    /**
	     * Get the split panel stretch factor for the given widget.
	     *
	     * @param widget - The widget of interest.
	     *
	     * @returns The split panel stretch factor for the widget.
	     */
	    function getStretch(widget) {
	        return layout_1.SplitLayout.getStretch(widget);
	    }
	    SplitPanel.getStretch = getStretch;
	    /**
	     * Set the split panel stretch factor for the given widget.
	     *
	     * @param widget - The widget of interest.
	     *
	     * @param value - The value for the stretch factor.
	     */
	    function setStretch(widget, value) {
	        layout_1.SplitLayout.setStretch(widget, value);
	    }
	    SplitPanel.setStretch = setStretch;
	})(SplitPanel = exports.SplitPanel || (exports.SplitPanel = {}));
	/**
	 * The namespace for the `SplitPanel` class private data.
	 */
	var SplitPanelPrivate;
	(function (SplitPanelPrivate) {
	    /**
	     * Find the split handle which contains the given target element.
	     */
	    function findHandle(layout, target) {
	        for (var i = 0, n = layout.childCount(); i < n; ++i) {
	            var handle = layout.handleAt(i);
	            if (handle.contains(target)) {
	                return { index: i, handle: handle };
	            }
	        }
	        return { index: -1, handle: null };
	    }
	    SplitPanelPrivate.findHandle = findHandle;
	})(SplitPanelPrivate || (SplitPanelPrivate = {}));


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(36);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./index.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./index.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, "/*-----------------------------------------------------------------------------\n| Copyright (c) 2014-2015, PhosphorJS Contributors\n|\n| Distributed under the terms of the BSD 3-Clause License.\n|\n| The full license is in the file LICENSE, distributed with this software.\n|----------------------------------------------------------------------------*/\n.p-SplitPanel {\n  z-index: 0;\n}\n\n\n.p-SplitPanel-child {\n  z-index: 0;\n}\n\n\n.p-SplitPanel-handle {\n  z-index: 1;\n}\n\n\n.p-SplitPanel-handle.p-mod-hidden {\n  display: none;\n}\n\n\n.p-SplitPanel-handle:after {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  content: '';\n}\n\n\n.p-SplitPanel.p-mod-horizontal > .p-SplitPanel-handle {\n  cursor: ew-resize;\n}\n\n\n.p-SplitPanel.p-mod-vertical > .p-SplitPanel-handle {\n  cursor: ns-resize;\n}\n\n\n.p-SplitPanel.p-mod-horizontal > .p-SplitPanel-handle:after {\n  left: 50%;\n  min-width: 7px;\n  transform: translateX(-50%);\n}\n\n\n.p-SplitPanel.p-mod-vertical > .p-SplitPanel-handle:after {\n  top: 50%;\n  min-height: 7px;\n  transform: translateY(-50%);\n}\n", ""]);

	// exports


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(38));
	__export(__webpack_require__(39));


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var phosphor_domutil_1 = __webpack_require__(7);
	var phosphor_messaging_1 = __webpack_require__(13);
	var phosphor_panel_1 = __webpack_require__(18);
	var phosphor_properties_1 = __webpack_require__(17);
	var phosphor_widget_1 = __webpack_require__(20);
	/**
	 * A layout where visible children are stacked atop one another.
	 *
	 * #### Notes
	 * The Z-order of the visible children follows their layout order.
	 */
	var StackedLayout = (function (_super) {
	    __extends(StackedLayout, _super);
	    function StackedLayout() {
	        _super.apply(this, arguments);
	        this._box = null;
	    }
	    /**
	     * Attach a child widget to the parent's DOM node.
	     *
	     * @param index - The current index of the child in the layout.
	     *
	     * @param child - The child widget to attach to the parent.
	     *
	     * #### Notes
	     * This is a reimplementation of the superclass method.
	     */
	    StackedLayout.prototype.attachChild = function (index, child) {
	        StackedLayoutPrivate.prepareGeometry(child);
	        this.parent.node.appendChild(child.node);
	        if (this.parent.isAttached)
	            phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgAfterAttach);
	        this.parent.fit();
	    };
	    /**
	     * Move a child widget in the parent's DOM node.
	     *
	     * @param fromIndex - The previous index of the child in the layout.
	     *
	     * @param toIndex - The current index of the child in the layout.
	     *
	     * @param child - The child widget to move in the parent.
	     *
	     * #### Notes
	     * This is a reimplementation of the superclass method.
	     */
	    StackedLayout.prototype.moveChild = function (fromIndex, toIndex, child) {
	        this.parent.update();
	    };
	    /**
	     * Detach a child widget from the parent's DOM node.
	     *
	     * @param index - The previous index of the child in the layout.
	     *
	     * @param child - The child widget to detach from the parent.
	     *
	     * #### Notes
	     * This is a reimplementation of the superclass method.
	     */
	    StackedLayout.prototype.detachChild = function (index, child) {
	        if (this.parent.isAttached)
	            phosphor_messaging_1.sendMessage(child, phosphor_widget_1.Widget.MsgBeforeDetach);
	        this.parent.node.removeChild(child.node);
	        StackedLayoutPrivate.resetGeometry(child);
	        child.node.style.zIndex = '';
	        this.parent.fit();
	    };
	    /**
	     * A message handler invoked on an `'after-show'` message.
	     */
	    StackedLayout.prototype.onAfterShow = function (msg) {
	        _super.prototype.onAfterShow.call(this, msg);
	        this.parent.update();
	    };
	    /**
	     * A message handler invoked on an `'after-attach'` message.
	     */
	    StackedLayout.prototype.onAfterAttach = function (msg) {
	        _super.prototype.onAfterAttach.call(this, msg);
	        this.parent.fit();
	    };
	    /**
	     * A message handler invoked on a `'child-shown'` message.
	     */
	    StackedLayout.prototype.onChildShown = function (msg) {
	        if (StackedLayoutPrivate.IsIE) {
	            phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgFitRequest);
	        }
	        else {
	            this.parent.fit();
	        }
	    };
	    /**
	     * A message handler invoked on a `'child-hidden'` message.
	     */
	    StackedLayout.prototype.onChildHidden = function (msg) {
	        if (StackedLayoutPrivate.IsIE) {
	            phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgFitRequest);
	        }
	        else {
	            this.parent.fit();
	        }
	    };
	    /**
	     * A message handler invoked on a `'resize'` message.
	     */
	    StackedLayout.prototype.onResize = function (msg) {
	        if (this.parent.isVisible) {
	            this._update(msg.width, msg.height);
	        }
	    };
	    /**
	     * A message handler invoked on an `'update-request'` message.
	     */
	    StackedLayout.prototype.onUpdateRequest = function (msg) {
	        if (this.parent.isVisible) {
	            this._update(-1, -1);
	        }
	    };
	    /**
	     * A message handler invoked on a `'fit-request'` message.
	     */
	    StackedLayout.prototype.onFitRequest = function (msg) {
	        if (this.parent.isAttached) {
	            this._fit();
	        }
	    };
	    /**
	     * Fit the layout to the total size required by the child widgets.
	     */
	    StackedLayout.prototype._fit = function () {
	        // Setup the initial size limits.
	        var minW = 0;
	        var minH = 0;
	        var maxW = Infinity;
	        var maxH = Infinity;
	        // Update the computed size limits.
	        for (var i = 0, n = this.childCount(); i < n; ++i) {
	            var child = this.childAt(i);
	            if (child.isHidden) {
	                continue;
	            }
	            var limits = phosphor_domutil_1.sizeLimits(child.node);
	            minW = Math.max(minW, limits.minWidth);
	            minH = Math.max(minH, limits.minHeight);
	            maxW = Math.min(maxW, limits.maxWidth);
	            maxH = Math.min(maxH, limits.maxHeight);
	        }
	        // Ensure max limits >= min limits.
	        maxW = Math.max(minW, maxW);
	        maxH = Math.max(minH, maxH);
	        // Update the box sizing and add it to the size constraints.
	        var box = this._box = phosphor_domutil_1.boxSizing(this.parent.node);
	        minW += box.horizontalSum;
	        minH += box.verticalSum;
	        maxW += box.horizontalSum;
	        maxH += box.verticalSum;
	        // Update the parent's size constraints.
	        var style = this.parent.node.style;
	        style.minWidth = minW + "px";
	        style.minHeight = minH + "px";
	        style.maxWidth = maxW === Infinity ? 'none' : maxW + "px";
	        style.maxHeight = maxH === Infinity ? 'none' : maxH + "px";
	        // Notify the ancestor that it should fit immediately.
	        var ancestor = this.parent.parent;
	        if (ancestor)
	            phosphor_messaging_1.sendMessage(ancestor, phosphor_widget_1.Widget.MsgFitRequest);
	        // Notify the parent that it should update immediately.
	        phosphor_messaging_1.sendMessage(this.parent, phosphor_widget_1.Widget.MsgUpdateRequest);
	    };
	    /**
	     * Update the layout position and size of the child widgets.
	     *
	     * The parent offset dimensions should be `-1` if unknown.
	     */
	    StackedLayout.prototype._update = function (offsetWidth, offsetHeight) {
	        // Bail early if there are no children to layout.
	        if (this.childCount() === 0) {
	            return;
	        }
	        // Measure the parent if the offset dimensions are unknown.
	        if (offsetWidth < 0) {
	            offsetWidth = this.parent.node.offsetWidth;
	        }
	        if (offsetHeight < 0) {
	            offsetHeight = this.parent.node.offsetHeight;
	        }
	        // Ensure the parent box sizing data is computed.
	        var box = this._box || (this._box = phosphor_domutil_1.boxSizing(this.parent.node));
	        // Compute the actual layout bounds adjusted for border and padding.
	        var top = box.paddingTop;
	        var left = box.paddingLeft;
	        var width = offsetWidth - box.horizontalSum;
	        var height = offsetHeight - box.verticalSum;
	        // Update the child stacking order and layout geometry.
	        for (var i = 0, n = this.childCount(); i < n; ++i) {
	            var child = this.childAt(i);
	            if (child.isHidden) {
	                continue;
	            }
	            child.node.style.zIndex = "" + i;
	            StackedLayoutPrivate.setGeometry(child, left, top, width, height);
	        }
	    };
	    return StackedLayout;
	})(phosphor_panel_1.PanelLayout);
	exports.StackedLayout = StackedLayout;
	/**
	 * The namespace for the `StackedLayout` class private data.
	 */
	var StackedLayoutPrivate;
	(function (StackedLayoutPrivate) {
	    /**
	     * A flag indicating whether the browser is IE.
	     */
	    StackedLayoutPrivate.IsIE = /Trident/.test(navigator.userAgent);
	    /**
	     * Prepare a child widget for absolute layout geometry.
	     */
	    function prepareGeometry(widget) {
	        widget.node.style.position = 'absolute';
	    }
	    StackedLayoutPrivate.prepareGeometry = prepareGeometry;
	    /**
	     * Reset the layout geometry for the given child widget.
	     */
	    function resetGeometry(widget) {
	        var rect = rectProperty.get(widget);
	        var style = widget.node.style;
	        rect.top = NaN;
	        rect.left = NaN;
	        rect.width = NaN;
	        rect.height = NaN;
	        style.position = '';
	        style.top = '';
	        style.left = '';
	        style.width = '';
	        style.height = '';
	    }
	    StackedLayoutPrivate.resetGeometry = resetGeometry;
	    /**
	     * Set the layout geometry for the given child widget.
	     */
	    function setGeometry(widget, left, top, width, height) {
	        var resized = false;
	        var style = widget.node.style;
	        var rect = rectProperty.get(widget);
	        if (rect.top !== top) {
	            rect.top = top;
	            style.top = top + "px";
	        }
	        if (rect.left !== left) {
	            rect.left = left;
	            style.left = left + "px";
	        }
	        if (rect.width !== width) {
	            resized = true;
	            rect.width = width;
	            style.width = width + "px";
	        }
	        if (rect.height !== height) {
	            resized = true;
	            rect.height = height;
	            style.height = height + "px";
	        }
	        if (resized) {
	            phosphor_messaging_1.sendMessage(widget, new phosphor_widget_1.ResizeMessage(width, height));
	        }
	    }
	    StackedLayoutPrivate.setGeometry = setGeometry;
	    /**
	     * A property descriptor for a widget offset rect.
	     */
	    var rectProperty = new phosphor_properties_1.Property({
	        name: 'rect',
	        create: function () { return ({ top: NaN, left: NaN, width: NaN, height: NaN }); },
	    });
	})(StackedLayoutPrivate || (StackedLayoutPrivate = {}));


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var phosphor_panel_1 = __webpack_require__(18);
	var phosphor_signaling_1 = __webpack_require__(22);
	var layout_1 = __webpack_require__(38);
	/**
	 * The class name added to StackedPanel instances.
	 */
	var STACKED_PANEL_CLASS = 'p-StackedPanel';
	/**
	 * The class name added to a StackedPanel child.
	 */
	var CHILD_CLASS = 'p-StackedPanel-child';
	/**
	 * A panel where visible children are stacked atop one another.
	 *
	 * #### Notes
	 * This class provides a convenience wrapper around a [[StackedLayout]].
	 */
	var StackedPanel = (function (_super) {
	    __extends(StackedPanel, _super);
	    /**
	     * Construct a new stacked panel.
	     */
	    function StackedPanel() {
	        _super.call(this);
	        this.addClass(STACKED_PANEL_CLASS);
	    }
	    /**
	     * Create a stacked layout for a stacked panel.
	     */
	    StackedPanel.createLayout = function () {
	        return new layout_1.StackedLayout();
	    };
	    Object.defineProperty(StackedPanel.prototype, "widgetRemoved", {
	        /**
	         * A signal emitted when a widget is removed from the panel.
	         */
	        get: function () {
	            return StackedPanelPrivate.widgetRemovedSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * A message handler invoked on a `'child-added'` message.
	     */
	    StackedPanel.prototype.onChildAdded = function (msg) {
	        msg.child.addClass(CHILD_CLASS);
	    };
	    /**
	     * A message handler invoked on a `'child-removed'` message.
	     */
	    StackedPanel.prototype.onChildRemoved = function (msg) {
	        msg.child.removeClass(CHILD_CLASS);
	        this.widgetRemoved.emit(msg.child);
	    };
	    return StackedPanel;
	})(phosphor_panel_1.Panel);
	exports.StackedPanel = StackedPanel;
	/**
	 * The namespace for the `StackedPanel` class private data.
	 */
	var StackedPanelPrivate;
	(function (StackedPanelPrivate) {
	    /**
	     * A signal emitted when a widget is removed from the panel.
	     */
	    StackedPanelPrivate.widgetRemovedSignal = new phosphor_signaling_1.Signal();
	})(StackedPanelPrivate || (StackedPanelPrivate = {}));


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(41));
	__export(__webpack_require__(42));
	__webpack_require__(43);


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var arrays = __webpack_require__(3);
	var phosphor_domutil_1 = __webpack_require__(7);
	var phosphor_signaling_1 = __webpack_require__(22);
	var phosphor_widget_1 = __webpack_require__(20);
	/**
	 * The class name added to TabBar instances.
	 */
	var TAB_BAR_CLASS = 'p-TabBar';
	/**
	 * The class name added to a tab bar body node.
	 */
	var BODY_CLASS = 'p-TabBar-body';
	/**
	 * The class name added to a tab bar header node.
	 */
	var HEADER_CLASS = 'p-TabBar-header';
	/**
	 * The class name added to a tab bar content node.
	 */
	var CONTENT_CLASS = 'p-TabBar-content';
	/**
	 * The class name added to a tab bar footer node.
	 */
	var FOOTER_CLASS = 'p-TabBar-footer';
	/**
	 * The class name added to a tab bar tab.
	 */
	var TAB_CLASS = 'p-TabBar-tab';
	/**
	 * The class name added to a tab text node.
	 */
	var TEXT_CLASS = 'p-TabBar-tabText';
	/**
	 * The class name added to a tab icon node.
	 */
	var ICON_CLASS = 'p-TabBar-tabIcon';
	/**
	 * The class name added to a tab close icon node.
	 */
	var CLOSE_CLASS = 'p-TabBar-tabCloseIcon';
	/**
	 * The class name added to a tab bar and tab when dragging.
	 */
	var DRAGGING_CLASS = 'p-mod-dragging';
	/**
	 * The class name added to the current tab.
	 */
	var CURRENT_CLASS = 'p-mod-current';
	/**
	 * The class name added to a closable tab.
	 */
	var CLOSABLE_CLASS = 'p-mod-closable';
	/**
	 * The start drag distance threshold.
	 */
	var DRAG_THRESHOLD = 5;
	/**
	 * The detach distance threshold.
	 */
	var DETACH_THRESHOLD = 20;
	/**
	 * The tab transition duration.
	 */
	var TRANSITION_DURATION = 150; // Keep in sync with CSS.
	/**
	 * A widget which displays tab items as a row of tabs.
	 */
	var TabBar = (function (_super) {
	    __extends(TabBar, _super);
	    /**
	     * Construct a new tab bar.
	     */
	    function TabBar() {
	        _super.call(this);
	        this._tabsMovable = false;
	        this._items = [];
	        this._tabs = [];
	        this._dirtySet = new Set();
	        this._currentItem = null;
	        this._dragData = null;
	        this.addClass(TAB_BAR_CLASS);
	    }
	    /**
	     * Create the DOM node for a tab bar.
	     */
	    TabBar.createNode = function () {
	        var node = document.createElement('div');
	        var header = document.createElement('div');
	        var body = document.createElement('div');
	        var footer = document.createElement('div');
	        var content = document.createElement('ul');
	        header.className = HEADER_CLASS;
	        body.className = BODY_CLASS;
	        footer.className = FOOTER_CLASS;
	        content.className = CONTENT_CLASS;
	        body.appendChild(content);
	        node.appendChild(header);
	        node.appendChild(body);
	        node.appendChild(footer);
	        return node;
	    };
	    /**
	     * Create and initialize a tab node for a tab bar.
	     *
	     * @param title - The title to use for the initial tab state.
	     *
	     * @returns A new DOM node to use as a tab in a tab bar.
	     *
	     * #### Notes
	     * It is not necessary to subscribe to the `changed` signal of the
	     * title. The tab bar subscribes to that signal and will call the
	     * [[updateTab]] static method automatically as needed.
	     *
	     * This method may be reimplemented to create custom tabs.
	     */
	    TabBar.createTab = function (title) {
	        var node = document.createElement('li');
	        var icon = document.createElement('span');
	        var text = document.createElement('span');
	        var close = document.createElement('span');
	        node.className = TAB_CLASS;
	        icon.className = ICON_CLASS;
	        text.className = TEXT_CLASS;
	        close.className = CLOSE_CLASS;
	        node.appendChild(icon);
	        node.appendChild(text);
	        node.appendChild(close);
	        this.updateTab(node, title);
	        return node;
	    };
	    /**
	     * Update a tab node to reflect the current state of a title.
	     *
	     * @param tab - A tab node created by a call to [[createTab]].
	     *
	     * @param title - The title object to use for the tab state.
	     *
	     * #### Notes
	     * This is called automatically when the title state changes.
	     *
	     * If the [[createTab]] method is reimplemented, this method should
	     * also be reimplemented so that the tab state is properly updated.
	     */
	    TabBar.updateTab = function (tab, title) {
	        var tabInfix = title.className ? ' ' + title.className : '';
	        var tabSuffix = title.closable ? ' ' + CLOSABLE_CLASS : '';
	        var iconSuffix = title.icon ? ' ' + title.icon : '';
	        var icon = tab.firstChild;
	        var text = icon.nextSibling;
	        tab.className = TAB_CLASS + tabInfix + tabSuffix;
	        icon.className = ICON_CLASS + iconSuffix;
	        text.textContent = title.text;
	    };
	    /**
	     * Get the close icon node for a given tab node.
	     *
	     * @param tab - A tab node created by a call to [[createTab]].
	     *
	     * @returns The close icon node for the tab node.
	     *
	     * #### Notes
	     * The close icon node is used to correctly process click events.
	     *
	     * If the [[createTab]] method is reimplemented, this method should
	     * also be reimplemented so that the correct icon node is returned.
	     */
	    TabBar.tabCloseIcon = function (tab) {
	        return tab.lastChild;
	    };
	    /**
	     * Dispose of the resources held by the widget.
	     */
	    TabBar.prototype.dispose = function () {
	        this._releaseMouse();
	        this._tabs.length = 0;
	        this._items.length = 0;
	        this._dirtySet.clear();
	        this._currentItem = null;
	        _super.prototype.dispose.call(this);
	    };
	    Object.defineProperty(TabBar.prototype, "currentChanged", {
	        /**
	         * A signal emitted when the current tab is changed.
	         */
	        get: function () {
	            return TabBarPrivate.currentChangedSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TabBar.prototype, "tabMoved", {
	        /**
	         * A signal emitted when a tab is moved by the user.
	         */
	        get: function () {
	            return TabBarPrivate.tabMovedSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TabBar.prototype, "tabCloseRequested", {
	        /**
	         * A signal emitted when the user clicks a tab's close icon.
	         */
	        get: function () {
	            return TabBarPrivate.tabCloseRequestedSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TabBar.prototype, "tabDetachRequested", {
	        /**
	         * A signal emitted when a tab is dragged beyond the detach threshold.
	         */
	        get: function () {
	            return TabBarPrivate.tabDetachRequestedSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TabBar.prototype, "currentItem", {
	        /**
	         * Get the currently selected tab item.
	         */
	        get: function () {
	            return this._currentItem;
	        },
	        /**
	         * Set the currently selected tab item.
	         */
	        set: function (value) {
	            var item = value || null;
	            if (this._currentItem === item) {
	                return;
	            }
	            var index = item ? this._items.indexOf(item) : -1;
	            if (item && index === -1) {
	                console.warn('Tab item not contained in tab bar.');
	                return;
	            }
	            this._currentItem = item;
	            this.currentChanged.emit({ index: index, item: item });
	            this.update();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TabBar.prototype, "tabsMovable", {
	        /**
	         * Get whether the tabs are movable by the user.
	         */
	        get: function () {
	            return this._tabsMovable;
	        },
	        /**
	         * Set whether the tabs are movable by the user.
	         */
	        set: function (value) {
	            this._tabsMovable = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TabBar.prototype, "headerNode", {
	        /**
	         * Get the tab bar header node.
	         *
	         * #### Notes
	         * This node can be used to add extra content to the tab bar header.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this.node.getElementsByClassName(HEADER_CLASS)[0];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TabBar.prototype, "bodyNode", {
	        /**
	         * Get the tab bar body node.
	         *
	         * #### Notes
	         * This node can be used to add extra content to the tab bar.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this.node.getElementsByClassName(BODY_CLASS)[0];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TabBar.prototype, "footerNode", {
	        /**
	         * Get the tab bar footer node.
	         *
	         * #### Notes
	         * This node can be used to add extra content to the tab bar footer.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this.node.getElementsByClassName(FOOTER_CLASS)[0];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TabBar.prototype, "contentNode", {
	        /**
	         * Get the tab bar content node.
	         *
	         * #### Notes
	         * This is the node which holds the tab nodes.
	         *
	         * Modifying this node directly can lead to undefined behavior.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this.node.getElementsByClassName(CONTENT_CLASS)[0];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Get the number of tab items in the tab bar.
	     *
	     * @returns The number of tab items in the tab bar.
	     */
	    TabBar.prototype.itemCount = function () {
	        return this._items.length;
	    };
	    /**
	     * Get the tab item at the specified index.
	     *
	     * @param index - The index of the tab item of interest.
	     *
	     * @returns The tab item at the specified index, or `undefined`.
	     */
	    TabBar.prototype.itemAt = function (index) {
	        return this._items[index];
	    };
	    /**
	     * Get the index of the specified tab item.
	     *
	     * @param item - The tab item of interest.
	     *
	     * @returns The index of the specified item, or `-1`.
	     */
	    TabBar.prototype.itemIndex = function (item) {
	        return this._items.indexOf(item);
	    };
	    /**
	     * Add a tab item to the end of the tab bar.
	     *
	     * @param item - The tab item to add to the tab bar.
	     *
	     * #### Notes
	     * If the item is already added to the tab bar, it will be moved.
	     */
	    TabBar.prototype.addItem = function (item) {
	        this.insertItem(this.itemCount(), item);
	    };
	    /**
	     * Insert a tab item at the specified index.
	     *
	     * @param index - The index at which to insert the item.
	     *
	     * @param item - The tab item to insert into the tab bar.
	     *
	     * #### Notes
	     * If the item is already added to the tab bar, it will be moved.
	     */
	    TabBar.prototype.insertItem = function (index, item) {
	        this._releaseMouse();
	        var n = this._items.length;
	        var i = this._items.indexOf(item);
	        var j = Math.max(0, Math.min(index | 0, n));
	        if (i !== -1) {
	            if (j === n)
	                j--;
	            if (i === j)
	                return;
	            arrays.move(this._tabs, i, j);
	            arrays.move(this._items, i, j);
	            this.contentNode.insertBefore(this._tabs[j], this._tabs[j + 1]);
	        }
	        else {
	            var tab = this.constructor.createTab(item.title);
	            arrays.insert(this._tabs, j, tab);
	            arrays.insert(this._items, j, item);
	            this.contentNode.insertBefore(tab, this._tabs[j + 1]);
	            item.title.changed.connect(this._onTitleChanged, this);
	            if (!this.currentItem)
	                this.currentItem = item;
	        }
	        this.update();
	    };
	    /**
	     * Remove a tab item from the tab bar.
	     *
	     * @param item - The tab item to remove from the tab bar.
	     *
	     * #### Notes
	     * If the item is not in the tab bar, this is a no-op.
	     */
	    TabBar.prototype.removeItem = function (item) {
	        this._releaseMouse();
	        var i = arrays.remove(this._items, item);
	        if (i === -1) {
	            return;
	        }
	        this._dirtySet.delete(item.title);
	        item.title.changed.disconnect(this._onTitleChanged, this);
	        this.contentNode.removeChild(arrays.removeAt(this._tabs, i));
	        if (this.currentItem === item) {
	            var next = this._items[i];
	            var prev = this._items[i - 1];
	            this.currentItem = next || prev;
	        }
	        this.update();
	    };
	    /**
	     * Get the tab node for the item at the given index.
	     *
	     * @param index - The index of the tab item of interest.
	     *
	     * @returns The tab node for the item, or `undefined`.
	     */
	    TabBar.prototype.tabAt = function (index) {
	        return this._tabs[index];
	    };
	    /**
	     * Release the mouse and restore the non-dragged tab positions.
	     *
	     * #### Notes
	     * This will cause the tab bar to stop handling mouse events and to
	     * restore the tabs to their non-dragged positions.
	     */
	    TabBar.prototype.releaseMouse = function () {
	        this._releaseMouse();
	    };
	    /**
	     * Handle the DOM events for the tab bar.
	     *
	     * @param event - The DOM event sent to the tab bar.
	     *
	     * #### Notes
	     * This method implements the DOM `EventListener` interface and is
	     * called in response to events on the tab bar's DOM node. It should
	     * not be called directly by user code.
	     */
	    TabBar.prototype.handleEvent = function (event) {
	        switch (event.type) {
	            case 'click':
	                this._evtClick(event);
	                break;
	            case 'mousedown':
	                this._evtMouseDown(event);
	                break;
	            case 'mousemove':
	                this._evtMouseMove(event);
	                break;
	            case 'mouseup':
	                this._evtMouseUp(event);
	                break;
	            case 'keydown':
	                this._evtKeyDown(event);
	                break;
	            case 'contextmenu':
	                event.preventDefault();
	                event.stopPropagation();
	                break;
	        }
	    };
	    /**
	     * A message handler invoked on an `'after-attach'` message.
	     */
	    TabBar.prototype.onAfterAttach = function (msg) {
	        this.node.addEventListener('click', this);
	        this.node.addEventListener('mousedown', this);
	    };
	    /**
	     * A message handler invoked on a `'before-detach'` message.
	     */
	    TabBar.prototype.onBeforeDetach = function (msg) {
	        this.node.removeEventListener('click', this);
	        this.node.removeEventListener('mousedown', this);
	        this._releaseMouse();
	    };
	    /**
	     * A message handler invoked on an `'update-request'` message.
	     */
	    TabBar.prototype.onUpdateRequest = function (msg) {
	        var tabs = this._tabs;
	        var items = this._items;
	        var dirty = this._dirtySet;
	        var current = this._currentItem;
	        var constructor = this.constructor;
	        for (var i = 0, n = tabs.length; i < n; ++i) {
	            var tab = tabs[i];
	            var item = items[i];
	            if (dirty.has(item.title)) {
	                constructor.updateTab(tab, item.title);
	            }
	            if (item === current) {
	                tab.classList.add(CURRENT_CLASS);
	                tab.style.zIndex = "" + n;
	            }
	            else {
	                tab.classList.remove(CURRENT_CLASS);
	                tab.style.zIndex = "" + (n - i - 1);
	            }
	        }
	        dirty.clear();
	    };
	    /**
	     * Handle the `'keydown'` event for the tab bar.
	     */
	    TabBar.prototype._evtKeyDown = function (event) {
	        // Stop all input events during drag.
	        event.preventDefault();
	        event.stopPropagation();
	        // Release the mouse if `Escape` is pressed.
	        if (event.keyCode === 27)
	            this._releaseMouse();
	    };
	    /**
	     * Handle the `'click'` event for the tab bar.
	     */
	    TabBar.prototype._evtClick = function (event) {
	        // Do nothing if it's not a left click.
	        if (event.button !== 0) {
	            return;
	        }
	        // Do nothing if a drag is in progress.
	        if (this._dragData) {
	            return;
	        }
	        // Do nothing if the click is not on a tab.
	        var x = event.clientX;
	        var y = event.clientY;
	        var i = arrays.findIndex(this._tabs, function (tab) { return phosphor_domutil_1.hitTest(tab, x, y); });
	        if (i < 0) {
	            return;
	        }
	        // Clicking on a tab stops the event propagation.
	        event.preventDefault();
	        event.stopPropagation();
	        // Ignore the click if the title is not closable.
	        var item = this._items[i];
	        if (!item.title.closable) {
	            return;
	        }
	        // Ignore the click if it was not on a close icon.
	        var constructor = this.constructor;
	        var icon = constructor.tabCloseIcon(this._tabs[i]);
	        if (!icon.contains(event.target)) {
	            return;
	        }
	        // Emit the tab close requested signal.
	        this.tabCloseRequested.emit({ index: i, item: item });
	    };
	    /**
	     * Handle the `'mousedown'` event for the tab bar.
	     */
	    TabBar.prototype._evtMouseDown = function (event) {
	        // Do nothing if it's not a left mouse press.
	        if (event.button !== 0) {
	            return;
	        }
	        // Do nothing if a drag is in progress.
	        if (this._dragData) {
	            return;
	        }
	        // Do nothing if the press is not on a tab.
	        var x = event.clientX;
	        var y = event.clientY;
	        var i = arrays.findIndex(this._tabs, function (tab) { return phosphor_domutil_1.hitTest(tab, x, y); });
	        if (i < 0) {
	            return;
	        }
	        // Pressing on a tab stops the event propagation.
	        event.preventDefault();
	        event.stopPropagation();
	        // Ignore the press if it was on a close icon.
	        var constructor = this.constructor;
	        var icon = constructor.tabCloseIcon(this._tabs[i]);
	        if (icon.contains(event.target)) {
	            return;
	        }
	        // Setup the drag data if the tabs are movable.
	        if (this._tabsMovable) {
	            this._dragData = new TabBarPrivate.DragData();
	            this._dragData.index = i;
	            this._dragData.tab = this._tabs[i];
	            this._dragData.pressX = event.clientX;
	            this._dragData.pressY = event.clientY;
	            document.addEventListener('mousemove', this, true);
	            document.addEventListener('mouseup', this, true);
	            document.addEventListener('keydown', this, true);
	            document.addEventListener('contextmenu', this, true);
	        }
	        // Update the current item to the pressed item.
	        this.currentItem = this._items[i];
	    };
	    /**
	     * Handle the `'mousemove'` event for the tab bar.
	     */
	    TabBar.prototype._evtMouseMove = function (event) {
	        // Do nothing if no drag is in progress.
	        if (!this._dragData) {
	            return;
	        }
	        // Suppress the event during a drag.
	        event.preventDefault();
	        event.stopPropagation();
	        // Ensure the drag threshold is exceeded before moving the tab.
	        var data = this._dragData;
	        if (!data.dragActive) {
	            var dx = Math.abs(event.clientX - data.pressX);
	            var dy = Math.abs(event.clientY - data.pressY);
	            if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
	                return;
	            }
	            // Fill in the rest of the drag data measurements.
	            var tabRect = data.tab.getBoundingClientRect();
	            data.tabLeft = data.tab.offsetLeft;
	            data.tabWidth = tabRect.width;
	            data.tabPressX = data.pressX - tabRect.left;
	            data.tabLayout = TabBarPrivate.snapTabLayout(this._tabs);
	            data.contentRect = this.contentNode.getBoundingClientRect();
	            data.override = phosphor_domutil_1.overrideCursor('default');
	            // Add the dragging classes and mark the drag as active.
	            data.tab.classList.add(DRAGGING_CLASS);
	            this.addClass(DRAGGING_CLASS);
	            data.dragActive = true;
	        }
	        // Emit the detach request signal if the threshold is exceeded.
	        if (!data.detachRequested && TabBarPrivate.detachExceeded(data, event)) {
	            data.detachRequested = true;
	            var index = data.index;
	            var item = this._items[index];
	            var clientX = event.clientX;
	            var clientY = event.clientY;
	            this.tabDetachRequested.emit({ index: index, item: item, clientX: clientX, clientY: clientY });
	            if (data.dragAborted) {
	                return;
	            }
	        }
	        // Update the tab layout and computed target index.
	        TabBarPrivate.layoutTabs(this._tabs, data, event);
	    };
	    /**
	     * Handle the `'mouseup'` event for the tab bar.
	     */
	    TabBar.prototype._evtMouseUp = function (event) {
	        var _this = this;
	        // Do nothing if it's not a left mouse release.
	        if (event.button !== 0) {
	            return;
	        }
	        // Do nothing if no drag is in progress.
	        if (!this._dragData) {
	            return;
	        }
	        // Suppress the event during a drag operation.
	        event.preventDefault();
	        event.stopPropagation();
	        // Remove the extra mouse event listeners.
	        document.removeEventListener('mousemove', this, true);
	        document.removeEventListener('mouseup', this, true);
	        document.removeEventListener('keydown', this, true);
	        document.removeEventListener('contextmenu', this, true);
	        // Bail early if the drag is not active.
	        var data = this._dragData;
	        if (!data.dragActive) {
	            this._dragData = null;
	            return;
	        }
	        // Position the tab at its final resting position.
	        TabBarPrivate.finalizeTabPosition(data);
	        // Remove the dragging class from the tab so it can be transitioned.
	        data.tab.classList.remove(DRAGGING_CLASS);
	        // Complete the release on a timer to allow the tab to transition.
	        setTimeout(function () {
	            // Do nothing if the drag has been aborted.
	            if (data.dragAborted) {
	                return;
	            }
	            // Clear the drag data reference.
	            _this._dragData = null;
	            // Reset the positions of the tabs.
	            TabBarPrivate.resetTabPositions(_this._tabs);
	            // Clear the cursor grab and drag styles.
	            data.override.dispose();
	            _this.removeClass(DRAGGING_CLASS);
	            // If the tab was not moved, there is nothing else to do.
	            var i = data.index;
	            var j = data.targetIndex;
	            if (j === -1 || i === j) {
	                return;
	            }
	            // Move the tab and related tab item to the new location.
	            arrays.move(_this._tabs, i, j);
	            arrays.move(_this._items, i, j);
	            _this.contentNode.insertBefore(_this._tabs[j], _this._tabs[j + 1]);
	            // Emit the tab moved signal and schedule a render update.
	            _this.tabMoved.emit({ fromIndex: i, toIndex: j, item: _this._items[j] });
	            _this.update();
	        }, TRANSITION_DURATION);
	    };
	    /**
	     * Release the mouse and restore the non-dragged tab positions.
	     */
	    TabBar.prototype._releaseMouse = function () {
	        // Do nothing if no drag is in progress.
	        if (!this._dragData) {
	            return;
	        }
	        // Remove the extra mouse listeners.
	        document.removeEventListener('mousemove', this, true);
	        document.removeEventListener('mouseup', this, true);
	        document.removeEventListener('keydown', this, true);
	        document.removeEventListener('contextmenu', this, true);
	        // Clear the drag data reference.
	        var data = this._dragData;
	        this._dragData = null;
	        // Indicate the drag has been aborted. This allows the mouse
	        // event handlers to return early when the drag is canceled.
	        data.dragAborted = true;
	        // If the drag is not active, there's nothing more to do.
	        if (!data.dragActive) {
	            return;
	        }
	        // Reset the tabs to their non-dragged positions.
	        TabBarPrivate.resetTabPositions(this._tabs);
	        // Clear the cursor override and extra styling classes.
	        data.override.dispose();
	        data.tab.classList.remove(DRAGGING_CLASS);
	        this.removeClass(DRAGGING_CLASS);
	    };
	    /**
	     * Handle the `changed` signal of a title object.
	     */
	    TabBar.prototype._onTitleChanged = function (sender) {
	        this._dirtySet.add(sender);
	        this.update();
	    };
	    return TabBar;
	})(phosphor_widget_1.Widget);
	exports.TabBar = TabBar;
	/**
	 * The namespace for the `TabBar` class private data.
	 */
	var TabBarPrivate;
	(function (TabBarPrivate) {
	    /**
	     * A signal emitted when the current tab item is changed.
	     */
	    TabBarPrivate.currentChangedSignal = new phosphor_signaling_1.Signal();
	    /**
	     * A signal emitted when a tab is moved by the user.
	     */
	    TabBarPrivate.tabMovedSignal = new phosphor_signaling_1.Signal();
	    /**
	     * A signal emitted when the user clicks a tab's close icon.
	     */
	    TabBarPrivate.tabCloseRequestedSignal = new phosphor_signaling_1.Signal();
	    /**
	     * A signal emitted when a tab is dragged beyond the detach threshold.
	     */
	    TabBarPrivate.tabDetachRequestedSignal = new phosphor_signaling_1.Signal();
	    /**
	     * A struct which holds the drag data for a tab bar.
	     */
	    var DragData = (function () {
	        function DragData() {
	            /**
	             * The tab node being dragged.
	             */
	            this.tab = null;
	            /**
	             * The index of the tab being dragged.
	             */
	            this.index = -1;
	            /**
	             * The offset left of the tab being dragged.
	             */
	            this.tabLeft = -1;
	            /**
	             * The offset width of the tab being dragged.
	             */
	            this.tabWidth = -1;
	            /**
	             * The original mouse X position in tab coordinates.
	             */
	            this.tabPressX = -1;
	            /**
	             * The tab target index upon mouse release.
	             */
	            this.targetIndex = -1;
	            /**
	             * The array of tab layout objects snapped at drag start.
	             */
	            this.tabLayout = null;
	            /**
	             * The mouse press client X position.
	             */
	            this.pressX = -1;
	            /**
	             * The mouse press client Y position.
	             */
	            this.pressY = -1;
	            /**
	             * The bounding client rect of the tab bar content node.
	             */
	            this.contentRect = null;
	            /**
	             * The disposable to clean up the cursor override.
	             */
	            this.override = null;
	            /**
	             * Whether the drag is currently active.
	             */
	            this.dragActive = false;
	            /**
	             * Whether the drag has been aborted.
	             */
	            this.dragAborted = false;
	            /**
	             * Whether a detach request as been made.
	             */
	            this.detachRequested = false;
	        }
	        return DragData;
	    })();
	    TabBarPrivate.DragData = DragData;
	    /**
	     * Get a snapshot of the current tab layout values.
	     */
	    function snapTabLayout(tabs) {
	        var layout = new Array(tabs.length);
	        for (var i = 0, n = tabs.length; i < n; ++i) {
	            var node = tabs[i];
	            var left = node.offsetLeft;
	            var width = node.offsetWidth;
	            var cstyle = window.getComputedStyle(node);
	            var margin = parseInt(cstyle.marginLeft, 10) || 0;
	            layout[i] = { margin: margin, left: left, width: width };
	        }
	        return layout;
	    }
	    TabBarPrivate.snapTabLayout = snapTabLayout;
	    /**
	     * Test if the event exceeds the drag detach threshold.
	     */
	    function detachExceeded(data, event) {
	        var rect = data.contentRect;
	        return ((event.clientX < rect.left - DETACH_THRESHOLD) ||
	            (event.clientX >= rect.right + DETACH_THRESHOLD) ||
	            (event.clientY < rect.top - DETACH_THRESHOLD) ||
	            (event.clientY >= rect.bottom + DETACH_THRESHOLD));
	    }
	    TabBarPrivate.detachExceeded = detachExceeded;
	    /**
	     * Update the relative tab positions and computed target index.
	     */
	    function layoutTabs(tabs, data, event) {
	        var targetIndex = data.index;
	        var targetLeft = event.clientX - data.contentRect.left - data.tabPressX;
	        var targetRight = targetLeft + data.tabWidth;
	        for (var i = 0, n = tabs.length; i < n; ++i) {
	            var style = tabs[i].style;
	            var layout = data.tabLayout[i];
	            var threshold = layout.left + (layout.width >> 1);
	            if (i < data.index && targetLeft < threshold) {
	                style.left = data.tabWidth + data.tabLayout[i + 1].margin + 'px';
	                targetIndex = Math.min(targetIndex, i);
	            }
	            else if (i > data.index && targetRight > threshold) {
	                style.left = -data.tabWidth - layout.margin + 'px';
	                targetIndex = Math.max(targetIndex, i);
	            }
	            else if (i === data.index) {
	                var ideal = event.clientX - data.pressX;
	                var limit = data.contentRect.width - (data.tabLeft + data.tabWidth);
	                style.left = Math.max(-data.tabLeft, Math.min(ideal, limit)) + 'px';
	            }
	            else {
	                style.left = '';
	            }
	        }
	        data.targetIndex = targetIndex;
	    }
	    TabBarPrivate.layoutTabs = layoutTabs;
	    /**
	     * Position the drag tab at its final resting relative position.
	     */
	    function finalizeTabPosition(data) {
	        var ideal;
	        if (data.targetIndex === data.index) {
	            ideal = 0;
	        }
	        else if (data.targetIndex > data.index) {
	            var tgt = data.tabLayout[data.targetIndex];
	            ideal = tgt.left + tgt.width - data.tabWidth - data.tabLeft;
	        }
	        else {
	            var tgt = data.tabLayout[data.targetIndex];
	            ideal = tgt.left - data.tabLeft;
	        }
	        var style = data.tab.style;
	        var limit = data.contentRect.width - (data.tabLeft + data.tabWidth);
	        style.left = Math.max(-data.tabLeft, Math.min(ideal, limit)) + 'px';
	    }
	    TabBarPrivate.finalizeTabPosition = finalizeTabPosition;
	    /**
	     * Reset the relative positions of the given tabs.
	     */
	    function resetTabPositions(tabs) {
	        for (var i = 0, n = tabs.length; i < n; ++i) {
	            tabs[i].style.left = '';
	        }
	    }
	    TabBarPrivate.resetTabPositions = resetTabPositions;
	})(TabBarPrivate || (TabBarPrivate = {}));


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var phosphor_boxpanel_1 = __webpack_require__(4);
	var phosphor_stackedpanel_1 = __webpack_require__(37);
	var phosphor_widget_1 = __webpack_require__(20);
	var tabbar_1 = __webpack_require__(41);
	/**
	 * The class name added to TabPanel instances.
	 */
	var TAB_PANEL_CLASS = 'p-TabPanel';
	/**
	 * The class name added to a TabPanel's tab bar.
	 */
	var TAB_BAR_CLASS = 'p-TabPanel-tabBar';
	/**
	 * The class name added to a TabPanel's stacked panel.
	 */
	var STACKED_PANEL_CLASS = 'p-TabPanel-stackedPanel';
	/**
	 * A widget which combines a `TabBar` and a `StackedPanel`.
	 *
	 * #### Notes
	 * This is a simple panel which handles the common case of a tab bar
	 * placed above a content area. The selected tab controls the widget
	 * which is shown in the content area.
	 *
	 * For use cases which require more control than is provided by this
	 * panel, the `TabBar` widget may be used independently.
	 */
	var TabPanel = (function (_super) {
	    __extends(TabPanel, _super);
	    /**
	     * Construct a new tab panel.
	     */
	    function TabPanel() {
	        _super.call(this);
	        this._currentWidget = null;
	        this.addClass(TAB_PANEL_CLASS);
	        var constructor = this.constructor;
	        this._tabBar = constructor.createTabBar();
	        this._stackedPanel = constructor.createStackedPanel();
	        this._tabBar.tabMoved.connect(this._onTabMoved, this);
	        this._tabBar.currentChanged.connect(this._onCurrentChanged, this);
	        this._tabBar.tabCloseRequested.connect(this._onTabCloseRequested, this);
	        this._stackedPanel.widgetRemoved.connect(this._onWidgetRemoved, this);
	        var layout = new phosphor_boxpanel_1.BoxLayout();
	        layout.direction = phosphor_boxpanel_1.BoxLayout.TopToBottom;
	        layout.spacing = 0;
	        phosphor_boxpanel_1.BoxLayout.setStretch(this._tabBar, 0);
	        phosphor_boxpanel_1.BoxLayout.setStretch(this._stackedPanel, 1);
	        layout.addChild(this._tabBar);
	        layout.addChild(this._stackedPanel);
	        this.layout = layout;
	    }
	    /**
	     * Create a `TabBar` for a tab panel.
	     *
	     * @returns A new tab bar to use with a tab panel.
	     *
	     * #### Notes
	     * This may be reimplemented by subclasses for custom tab bars.
	     */
	    TabPanel.createTabBar = function () {
	        var tabBar = new tabbar_1.TabBar();
	        tabBar.addClass(TAB_BAR_CLASS);
	        return tabBar;
	    };
	    /**
	     * Create a `StackedPanel` for a tab panel.
	     *
	     * @returns A new stacked panel to use with a tab panel.
	     *
	     * #### Notes
	     * This may be reimplemented by subclasses for custom stacks.
	     */
	    TabPanel.createStackedPanel = function () {
	        var stackedPanel = new phosphor_stackedpanel_1.StackedPanel();
	        stackedPanel.addClass(STACKED_PANEL_CLASS);
	        return stackedPanel;
	    };
	    /**
	     * Dispose of the resources held by the widget.
	     */
	    TabPanel.prototype.dispose = function () {
	        this._tabBar = null;
	        this._stackedPanel = null;
	        this._currentWidget = null;
	        _super.prototype.dispose.call(this);
	    };
	    Object.defineProperty(TabPanel.prototype, "currentWidget", {
	        /**
	         * Get the currently selected widget.
	         */
	        get: function () {
	            return this._tabBar.currentItem;
	        },
	        /**
	         * Set the currently selected widget.
	         */
	        set: function (value) {
	            this._tabBar.currentItem = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TabPanel.prototype, "tabsMovable", {
	        /**
	         * Get whether the tabs are movable by the user.
	         */
	        get: function () {
	            return this._tabBar.tabsMovable;
	        },
	        /**
	         * Set whether the tabs are movable by the user.
	         */
	        set: function (value) {
	            this._tabBar.tabsMovable = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TabPanel.prototype, "tabBar", {
	        /**
	         * Get the tab bar associated with the tab panel.
	         *
	         * #### Notes
	         * Modifying the tab bar directly can lead to undefined behavior.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._tabBar;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(TabPanel.prototype, "stackedPanel", {
	        /**
	         * Get the stacked panel associated with the tab panel.
	         *
	         * #### Notes
	         * Modifying the stack directly can lead to undefined behavior.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._stackedPanel;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Get the number of child widgets in the tab panel.
	     *
	     * @returns The number of child widgets in the tab panel.
	     *
	     * #### Notes
	     * This delegates to the `childCount` method of the stacked panel.
	     */
	    TabPanel.prototype.childCount = function () {
	        return this._stackedPanel.childCount();
	    };
	    /**
	     * Get the child widget at the specified index.
	     *
	     * @param index - The index of the child widget of interest.
	     *
	     * @returns The child at the specified index, or `undefined`.
	     *
	     * #### Notes
	     * This delegates to the `childAt` method of the stacked panel.
	     */
	    TabPanel.prototype.childAt = function (index) {
	        return this._stackedPanel.childAt(index);
	    };
	    /**
	     * Get the index of the specified child widget.
	     *
	     * @param child - The child widget of interest.
	     *
	     * @returns The index of the specified child, or `-1`.
	     *
	     * #### Notes
	     * This delegates to the `childIndex` method of the stacked panel.
	     */
	    TabPanel.prototype.childIndex = function (child) {
	        return this._stackedPanel.childIndex(child);
	    };
	    /**
	     * Add a child widget to the end of the tab panel.
	     *
	     * @param child - The child widget to add to the tab panel.
	     *
	     * #### Notes
	     * If the child is already contained in the panel, it will be moved.
	     */
	    TabPanel.prototype.addChild = function (child) {
	        this.insertChild(this.childCount(), child);
	    };
	    /**
	     * Insert a child widget at the specified index.
	     *
	     * @param index - The index at which to insert the child.
	     *
	     * @param child - The child widget to insert into to the tab panel.
	     *
	     * #### Notes
	     * If the child is already contained in the panel, it will be moved.
	     */
	    TabPanel.prototype.insertChild = function (index, child) {
	        if (child !== this._currentWidget)
	            child.hide();
	        this._stackedPanel.insertChild(index, child);
	        this._tabBar.insertItem(index, child);
	    };
	    /**
	     * Handle the `currentChanged` signal from the tab bar.
	     */
	    TabPanel.prototype._onCurrentChanged = function (sender, args) {
	        var oldWidget = this._currentWidget;
	        var newWidget = args.item;
	        if (oldWidget === newWidget)
	            return;
	        this._currentWidget = newWidget;
	        if (oldWidget)
	            oldWidget.hide();
	        if (newWidget)
	            newWidget.show();
	    };
	    /**
	     * Handle the `tabCloseRequested` signal from the tab bar.
	     */
	    TabPanel.prototype._onTabCloseRequested = function (sender, args) {
	        args.item.close();
	    };
	    /**
	     * Handle the `tabMoved` signal from the tab bar.
	     */
	    TabPanel.prototype._onTabMoved = function (sender, args) {
	        this._stackedPanel.insertChild(args.toIndex, args.item);
	    };
	    /**
	     * Handle the `widgetRemoved` signal from the stacked panel.
	     */
	    TabPanel.prototype._onWidgetRemoved = function (sender, widget) {
	        if (this._currentWidget === widget)
	            this._currentWidget = null;
	        this._tabBar.removeItem(widget);
	    };
	    return TabPanel;
	})(phosphor_widget_1.Widget);
	exports.TabPanel = TabPanel;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(44);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./index.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./index.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, "/*-----------------------------------------------------------------------------\r\n| Copyright (c) 2014-2015, PhosphorJS Contributors\r\n|\r\n| Distributed under the terms of the BSD 3-Clause License.\r\n|\r\n| The full license is in the file LICENSE, distributed with this software.\r\n|----------------------------------------------------------------------------*/\r\n.p-TabBar {\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n\r\n\r\n.p-TabBar-header,\r\n.p-TabBar-footer {\r\n  flex: 0 0 auto;\r\n}\r\n\r\n\r\n.p-TabBar-body {\r\n  display: flex;\r\n  flex-direction: row;\r\n  flex: 1 1 auto;\r\n}\r\n\r\n\r\n.p-TabBar-content {\r\n  display: flex;\r\n  flex-direction: row;\r\n  flex: 1 1 auto;\r\n  margin: 0;\r\n  padding: 0;\r\n  list-style-type: none;\r\n}\r\n\r\n\r\n.p-TabBar-tab {\r\n  display: flex;\r\n  flex-direction: row;\r\n  box-sizing: border-box;\r\n  overflow: hidden;\r\n}\r\n\r\n\r\n.p-TabBar-tabIcon,\r\n.p-TabBar-tabCloseIcon {\r\n  flex: 0 0 auto;\r\n}\r\n\r\n\r\n.p-TabBar-tabText {\r\n  flex: 1 1 auto;\r\n  overflow: hidden;\r\n  white-space: nowrap;\r\n}\r\n\r\n\r\n.p-TabBar.p-mod-dragging .p-TabBar-tab {\r\n  position: relative;\r\n  left: 0;\r\n  transition: left 150ms ease; /* keep in sync with JS */\r\n}\r\n\r\n\r\n.p-TabBar.p-mod-dragging .p-TabBar-tab.p-mod-dragging {\r\n  transition: none;\r\n}\r\n\r\n\r\n.p-TabPanel-tabBar {\r\n  z-index: 1;\r\n}\r\n\r\n\r\n.p-TabPanel-stackedPanel {\r\n  z-index: 0;\r\n}\r\n", ""]);

	// exports


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(46);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./index.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./index.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, "/*-----------------------------------------------------------------------------\r\n| Copyright (c) 2014-2015, PhosphorJS Contributors\r\n|\r\n| Distributed under the terms of the BSD 3-Clause License.\r\n|\r\n| The full license is in the file LICENSE, distributed with this software.\r\n|----------------------------------------------------------------------------*/\r\n.p-DockPanel {\r\n  position: relative;\r\n  z-index: 0;\r\n}\r\n\r\n\r\n.p-DockPanel > .p-Widget {\r\n  position: absolute;\r\n  z-index: 0;\r\n}\r\n\r\n\r\n.p-DockPanel-overlay {\r\n  box-sizing: border-box;\r\n  position: absolute;\r\n  top: 0;\r\n  left: 0;\r\n  width: 0;\r\n  height: 0;\r\n  z-index: 1;\r\n  pointer-events: none;\r\n}\r\n\r\n\r\n.p-TabBar-tab.p-mod-hidden,\r\n.p-DockPanel-overlay.p-mod-hidden {\r\n  display: none;\r\n}\r\n", ""]);

	// exports


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	var arrays = __webpack_require__(3);
	var phosphor_domutil_1 = __webpack_require__(7);
	var phosphor_properties_1 = __webpack_require__(17);
	var phosphor_signaling_1 = __webpack_require__(22);
	var phosphor_widget_1 = __webpack_require__(20);
	__webpack_require__(48);
	/**
	 * The class name added to SideBar instances.
	 */
	var SIDE_BAR_CLASS = 'p-SideBar';
	/**
	 * The class name added to the side bar content node.
	 */
	var CONTENT_CLASS = 'p-SideBar-content';
	/**
	 * The class name added to side bar button nodes.
	 */
	var BUTTON_CLASS = 'p-SideBar-button';
	/**
	 * The class name added to a side bar button text node.
	 */
	var TEXT_CLASS = 'p-SideBar-button-text';
	/**
	 * The class name added to a side bar button icon node.
	 */
	var ICON_CLASS = 'p-SideBar-button-icon';
	/**
	 * The class name added to the current side bar button.
	 */
	var CURRENT_CLASS = 'p-mod-current';
	/**
	 * A widget which displays titles as a row of exclusive buttons.
	 */
	var SideBar = (function (_super) {
	    __extends(SideBar, _super);
	    /**
	     * Construct a new side bar.
	     */
	    function SideBar() {
	        _super.call(this);
	        this._dirty = false;
	        this._titles = [];
	        this.addClass(SIDE_BAR_CLASS);
	    }
	    /**
	     * Create the DOM node for a side bar.
	     */
	    SideBar.createNode = function () {
	        var node = document.createElement('div');
	        var content = document.createElement('ul');
	        content.className = CONTENT_CLASS;
	        node.appendChild(content);
	        return node;
	    };
	    /**
	     * Dispose of the resources held by the widget.
	     */
	    SideBar.prototype.dispose = function () {
	        this._titles.length = 0;
	        _super.prototype.dispose.call(this);
	    };
	    Object.defineProperty(SideBar.prototype, "currentChanged", {
	        /**
	         * A signal emitted when the current side bar title is changed.
	         */
	        get: function () {
	            return SideBarPrivate.currentChangedSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SideBar.prototype, "currentTitle", {
	        /**
	         * Get the currently selected side bar title.
	         */
	        get: function () {
	            return SideBarPrivate.currentTitleProperty.get(this);
	        },
	        /**
	         * Set the currently selected side bar title.
	         */
	        set: function (value) {
	            SideBarPrivate.currentTitleProperty.set(this, value);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(SideBar.prototype, "contentNode", {
	        /**
	         * Get the content node which holds the side bar buttons.
	         *
	         * #### Notes
	         * Modifying this node can lead to undefined behavior.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this.node.getElementsByClassName(CONTENT_CLASS)[0];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Get the number of title objects in the side bar.
	     *
	     * @returns The number of title objects in the side bar.
	     */
	    SideBar.prototype.titleCount = function () {
	        return this._titles.length;
	    };
	    /**
	     * Get the title object at the specified index.
	     *
	     * @param index - The index of the title object of interest.
	     *
	     * @returns The title at the specified index, or `undefined`.
	     */
	    SideBar.prototype.titleAt = function (index) {
	        return this._titles[index];
	    };
	    /**
	     * Get the index of the specified title object.
	     *
	     * @param title - The title object of interest.
	     *
	     * @returns The index of the specified title, or `-1`.
	     */
	    SideBar.prototype.titleIndex = function (title) {
	        return this._titles.indexOf(title);
	    };
	    /**
	     * Add a title object to the end of the side bar.
	     *
	     * @param title - The title object to add to the side bar.
	     *
	     * #### Notes
	     * If the title is already added to the side bar, it will be moved.
	     */
	    SideBar.prototype.addTitle = function (title) {
	        this.insertTitle(this.titleCount(), title);
	    };
	    /**
	     * Insert a title object at the specified index.
	     *
	     * @param index - The index at which to insert the title.
	     *
	     * @param title - The title object to insert into to the side bar.
	     *
	     * #### Notes
	     * If the title is already added to the side bar, it will be moved.
	     */
	    SideBar.prototype.insertTitle = function (index, title) {
	        var n = this.titleCount();
	        var i = this.titleIndex(title);
	        var j = Math.max(0, Math.min(index | 0, n));
	        if (i !== -1) {
	            if (j === n)
	                j--;
	            if (i === j)
	                return;
	            arrays.move(this._titles, i, j);
	        }
	        else {
	            arrays.insert(this._titles, j, title);
	            title.changed.connect(this._onTitleChanged, this);
	        }
	        this._dirty = true;
	        this.update();
	    };
	    /**
	     * Remove a title object from the side bar.
	     *
	     * @param title - The title object to remove from the side bar.
	     *
	     * #### Notes
	     * If the title is not in the side bar, this is a no-op.
	     */
	    SideBar.prototype.removeTitle = function (title) {
	        var i = arrays.remove(this._titles, title);
	        if (i === -1) {
	            return;
	        }
	        title.changed.disconnect(this._onTitleChanged, this);
	        if (this.currentTitle === title)
	            this.currentTitle = null;
	        this._dirty = true;
	        this.update();
	    };
	    /**
	     * Handle the DOM events for the side bar.
	     *
	     * @param event - The DOM event sent to the side bar.
	     *
	     * #### Notes
	     * This method implements the DOM `EventListener` interface and is
	     * called in response to events on the side bar's DOM node. It should
	     * not be called directly by user code.
	     */
	    SideBar.prototype.handleEvent = function (event) {
	        if (event.type === 'mousedown') {
	            this._evtMouseDown(event);
	        }
	    };
	    /**
	     * A message handler invoked on an `'after-attach'` message.
	     */
	    SideBar.prototype.onAfterAttach = function (msg) {
	        this.node.addEventListener('mousedown', this);
	    };
	    /**
	     * A message handler invoked on a `'before-detach'` message.
	     */
	    SideBar.prototype.onBeforeDetach = function (msg) {
	        this.node.removeEventListener('mousedown', this);
	    };
	    /**
	     * A message handler invoked on an `'update-request'` message.
	     */
	    SideBar.prototype.onUpdateRequest = function (msg) {
	        if (this._dirty) {
	            this._dirty = false;
	            SideBarPrivate.updateButtons(this);
	        }
	        else {
	            SideBarPrivate.updateCurrent(this);
	        }
	    };
	    /**
	     * Handle the `'mousedown'` event for the side bar.
	     */
	    SideBar.prototype._evtMouseDown = function (event) {
	        // Do nothing if it's not a left mouse press.
	        if (event.button !== 0) {
	            return;
	        }
	        // Do nothing if the press is not on a button.
	        var i = SideBarPrivate.hitTestButtons(this, event.clientX, event.clientY);
	        if (i < 0) {
	            return;
	        }
	        // Pressing on a button stops the event propagation.
	        event.preventDefault();
	        event.stopPropagation();
	        // Update the current title.
	        var title = this._titles[i];
	        if (title !== this.currentTitle) {
	            this.currentTitle = title;
	        }
	        else {
	            this.currentTitle = null;
	        }
	    };
	    /**
	     * Handle the `changed` signal of a title object.
	     */
	    SideBar.prototype._onTitleChanged = function () {
	        this._dirty = true;
	        this.update();
	    };
	    return SideBar;
	}(phosphor_widget_1.Widget));
	exports.SideBar = SideBar;
	/**
	 * The namespace for the `SideBar` class private data.
	 */
	var SideBarPrivate;
	(function (SideBarPrivate) {
	    /**
	     * A signal emitted when the current title is changed.
	     */
	    SideBarPrivate.currentChangedSignal = new phosphor_signaling_1.Signal();
	    /**
	     * The property descriptor for the current side bar title.
	     */
	    SideBarPrivate.currentTitleProperty = new phosphor_properties_1.Property({
	        name: 'currentTitle',
	        value: null,
	        coerce: coerceCurrentTitle,
	        changed: onCurrentTitleChanged,
	        notify: SideBarPrivate.currentChangedSignal,
	    });
	    /**
	     * Update the side bar buttons to match the current titles.
	     *
	     * This is a full update which also updates the currrent state.
	     */
	    function updateButtons(owner) {
	        var count = owner.titleCount();
	        var content = owner.contentNode;
	        var children = content.children;
	        while (children.length > count) {
	            content.removeChild(content.lastChild);
	        }
	        while (children.length < count) {
	            content.appendChild(createButtonNode());
	        }
	        for (var i = 0; i < count; ++i) {
	            var node = children[i];
	            updateButtonNode(node, owner.titleAt(i));
	        }
	        updateCurrent(owner);
	    }
	    SideBarPrivate.updateButtons = updateButtons;
	    /**
	     * Update the current state of the buttons to match the side bar.
	     *
	     * This is a partial update which only updates the current button
	     * class. It assumes the button count is the same as the title count.
	     */
	    function updateCurrent(owner) {
	        var count = owner.titleCount();
	        var content = owner.contentNode;
	        var children = content.children;
	        var current = owner.currentTitle;
	        for (var i = 0; i < count; ++i) {
	            var node = children[i];
	            if (owner.titleAt(i) === current) {
	                node.classList.add(CURRENT_CLASS);
	            }
	            else {
	                node.classList.remove(CURRENT_CLASS);
	            }
	        }
	    }
	    SideBarPrivate.updateCurrent = updateCurrent;
	    /**
	     * Get the index of the button node at a client position, or `-1`.
	     */
	    function hitTestButtons(owner, x, y) {
	        var nodes = owner.contentNode.children;
	        for (var i = 0, n = nodes.length; i < n; ++i) {
	            if (phosphor_domutil_1.hitTest(nodes[i], x, y))
	                return i;
	        }
	        return -1;
	    }
	    SideBarPrivate.hitTestButtons = hitTestButtons;
	    /**
	     * The coerce handler for the `currentTitle` property.
	     */
	    function coerceCurrentTitle(owner, value) {
	        return (value && owner.titleIndex(value) !== -1) ? value : null;
	    }
	    /**
	     * The change handler for the `currentTitle` property.
	     */
	    function onCurrentTitleChanged(owner) {
	        owner.update();
	    }
	    /**
	     * Create an uninitialized DOM node for a side bar button.
	     */
	    function createButtonNode() {
	        var node = document.createElement('li');
	        var icon = document.createElement('span');
	        var text = document.createElement('span');
	        text.className = TEXT_CLASS;
	        node.appendChild(icon);
	        node.appendChild(text);
	        return node;
	    }
	    /**
	     * Update a button node to reflect the state of a title.
	     */
	    function updateButtonNode(node, title) {
	        var icon = node.firstChild;
	        var text = node.lastChild;
	        if (title.className) {
	            node.className = BUTTON_CLASS + ' ' + title.className;
	        }
	        else {
	            node.className = BUTTON_CLASS;
	        }
	        if (title.icon) {
	            icon.className = ICON_CLASS + ' ' + title.icon;
	        }
	        else {
	            icon.className = ICON_CLASS;
	        }
	        text.textContent = title.text;
	    }
	})(SideBarPrivate || (SideBarPrivate = {}));


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(49);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../../node_modules/css-loader/index.js!./sidebar.css", function() {
				var newContent = require("!!./../../../../../node_modules/css-loader/index.js!./sidebar.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, "/*-----------------------------------------------------------------------------\n| Copyright (c) 2014-2016, PhosphorJS Contributors\n|\n| Distributed under the terms of the BSD 3-Clause License.\n|\n| The full license is in the file LICENSE, distributed with this software.\n|----------------------------------------------------------------------------*/\n.p-SideBar-content {\n  margin: 0;\n  padding: 0;\n  display: flex;\n  align-items: stretch;\n  list-style-type: none;\n}\n", ""]);

	// exports


/***/ },
/* 50 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * A class which manages a registry of extensions.
	 *
	 * #### Notes
	 * A service registry is used by populating it with extension objects,
	 * then calling the `activate` method to activate a specific extension.
	 *
	 * This class is used internally by the `Application` class. It will
	 * not typically be used directly by user code.
	 */
	var ExtensionRegistry = (function () {
	    /**
	     * Construct a new extension registry.
	     */
	    function ExtensionRegistry() {
	        this._extensionsByID = Private.createExtensionIDMap();
	    }
	    /**
	     * Register an extension with the registry.
	     *
	     * @param extension - The extension to add to the registry.
	     *
	     * #### Notes
	     * An error will be thrown if the extension id is already registered.
	     */
	    ExtensionRegistry.prototype.registerExtension = function (extension) {
	        // Throw an error if the extension id is already registered.
	        if (extension.id in this._extensionsByID) {
	            throw new Error("extension '" + extension.id + "' already registered");
	        }
	        // Create the extended extension and add it to the registry.
	        var ext = Private.createExtensionEx(extension);
	        this._extensionsByID[ext.id] = ext;
	    };
	    /**
	     * List the IDs of all extensions in the registry.
	     *
	     * @returns A new array of all extension IDs in the registry.
	     */
	    ExtensionRegistry.prototype.listExtensions = function () {
	        return Object.keys(this._extensionsByID);
	    };
	    /**
	     * Test whether the registry has an extension with the given id.
	     *
	     * @param id - The id of the extension of interest.
	     *
	     * @returns `true` if an extension with the specified id is
	     *   registered, `false` otherwise.
	     */
	    ExtensionRegistry.prototype.hasExtension = function (id) {
	        return id in this._extensionsByID;
	    };
	    /**
	     * Activate the extension with the given id.
	     *
	     * @param id - The ID of the extension of interest.
	     *
	     * @param context - The context object to pass as the first argument
	     *   to the extension's `activate` function.
	     *
	     * @param services - The service registry for resolving the services
	     *   required by the extension.
	     *
	     * @returns A promise which resolves when the extension is fully
	     *   activated or rejects with an error if it cannot be activated.
	     */
	    ExtensionRegistry.prototype.activateExtension = function (id, context, services) {
	        // Reject the promise if the extension is not registered.
	        var ext = this._extensionsByID[id];
	        if (!ext) {
	            return Promise.reject(new Error("extension '" + id + "' not registered"));
	        }
	        // Resolve immediately if the extension is already activated.
	        if (ext.activated) {
	            return Promise.resolve();
	        }
	        // Return the pending resolver promise if it exists.
	        if (ext.promise) {
	            return ext.promise;
	        }
	        // Resolve the services required by the extension.
	        var promises = ext.requires.map(function (req) { return services.resolveService(req); });
	        // Setup the resolver promise for the extension.
	        ext.promise = Promise.all(promises).then(function (deps) {
	            deps.unshift(context);
	            return ext.activate.apply(void 0, deps);
	        }).then(function () {
	            ext.promise = null;
	            ext.activated = true;
	        }).catch(function (error) {
	            ext.promise = null;
	            throw error;
	        });
	        // Return the pending resolver promise.
	        return ext.promise;
	    };
	    return ExtensionRegistry;
	}());
	exports.ExtensionRegistry = ExtensionRegistry;
	/**
	 * The namespace for the private extension registry functionality.
	 */
	var Private;
	(function (Private) {
	    /**
	     * Create new extension id map.
	     */
	    function createExtensionIDMap() {
	        return Object.create(null);
	    }
	    Private.createExtensionIDMap = createExtensionIDMap;
	    /**
	     * Create a new extended extension.
	     *
	     * @param extension - The extension source object.
	     *
	     * @returns A new extended extension initialized with the data
	     *   from the given extension.
	     *
	     * #### Notes
	     * The `requires` property of the extended extension will always be
	     * specified. If the original extension does not have dependencies,
	     * the `requires` array will be empty.
	     */
	    function createExtensionEx(extension) {
	        var id = extension.id, requires = extension.requires, activate = extension.activate;
	        requires = requires ? requires.slice() : [];
	        return { id: id, requires: requires, activate: activate, activated: false, promise: null };
	    }
	    Private.createExtensionEx = createExtensionEx;
	})(Private || (Private = {}));


/***/ },
/* 51 */
/***/ function(module, exports) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	"use strict";
	/**
	 * A class which manages a registry of service providers.
	 *
	 * #### Notes
	 * A service registry is used by populating it with service providers,
	 * then calling the `resolve` method to get the singleton instance of
	 * a specified service type.
	 *
	 * This class is used internally by the `Application` class. It will
	 * not typically be used directly by user code.
	 */
	var ServiceRegistry = (function () {
	    /**
	     * Construct a new service registry.
	     */
	    function ServiceRegistry() {
	        this._providersByID = Private.createProviderIDMap();
	        this._providersByType = Private.createProviderTypeMap();
	    }
	    /**
	     * Register a service provider with the registry.
	     *
	     * @param provider - The service provider to add to the registry.
	     *
	     * #### Notes
	     * An error will be thrown if a provider with the same id is already
	     * registered, if a provider which provides the identical service is
	     * already registered, or if the provider has a circular dependency.
	     */
	    ServiceRegistry.prototype.registerProvider = function (provider) {
	        // Throw an error if the provider id is already registered.
	        var pid = provider.id;
	        if (pid in this._providersByID) {
	            throw new Error("provider '" + pid + "' already registered");
	        }
	        // Throw an error if the service type is already registered.
	        var other = this._providersByType.get(provider.provides);
	        if (other) {
	            throw new Error("'" + pid + "' service already provided by '" + other.id + "'");
	        }
	        // Throw an error if the provider has a circular dependency.
	        var cycle = Private.findCycle(provider, this._providersByType);
	        if (cycle) {
	            throw new Error("provider cycle detected: " + cycle.join(' -> '));
	        }
	        // Create the extended provider and add it to the registry.
	        var pex = Private.createProviderEx(provider);
	        this._providersByType.set(pex.provides, pex);
	        this._providersByID[pex.id] = pex;
	    };
	    /**
	     * List the IDs of all service providers in the registry.
	     *
	     * @returns A new array of all provider IDs in the registry.
	     */
	    ServiceRegistry.prototype.listProviders = function () {
	        return Object.keys(this._providersByID);
	    };
	    /**
	     * Test whether the registry has a provider with the given id.
	     *
	     * @param id - The id of the provider of interest.
	     *
	     * @returns `true` if a service provider with the specified id is
	     *   registered, `false` otherwise.
	     */
	    ServiceRegistry.prototype.hasProvider = function (id) {
	        return id in this._providersByID;
	    };
	    /**
	     * Test whether the registry has a provider for the given service.
	     *
	     * @param kind - The type of the service of interest.
	     *
	     * @returns `true` if a service provider is registered for the
	     *   specified service type, `false` otherwise.
	     */
	    ServiceRegistry.prototype.hasProviderFor = function (kind) {
	        return this._providersByType.has(kind);
	    };
	    /**
	     * Resolve a service implementation for the given type.
	     *
	     * @param kind - The type of service object to resolve.
	     *
	     * @returns A promise which resolves the specified service type,
	     *   or rejects with an error if it cannot be satisfied.
	     *
	     * #### Notes
	     * Services are singletons. The same service instance will be
	     * returned each time a given service type is resolved.
	     */
	    ServiceRegistry.prototype.resolveService = function (kind) {
	        return Private.resolveService(kind, this._providersByType, []);
	    };
	    return ServiceRegistry;
	}());
	exports.ServiceRegistry = ServiceRegistry;
	/**
	 * The namespace for the private service registry functionality.
	 */
	var Private;
	(function (Private) {
	    /**
	     * Create new provider id map.
	     */
	    function createProviderIDMap() {
	        return Object.create(null);
	    }
	    Private.createProviderIDMap = createProviderIDMap;
	    /**
	     * Create a new provider type map.
	     */
	    function createProviderTypeMap() {
	        return new Map();
	    }
	    Private.createProviderTypeMap = createProviderTypeMap;
	    /**
	     * Create a new extended provider.
	     *
	     * @param provider - The service provider source object.
	     *
	     * @returns A new extended provider initialized with the data
	     *   from the given service provider.
	     *
	     * #### Notes
	     * The `requires` property of the extended provider will always be
	     * specified. If the original provider does not have dependencies,
	     * the `requires` array will be empty.
	     */
	    function createProviderEx(provider) {
	        var id = provider.id, provides = provider.provides, requires = provider.requires, resolve = provider.resolve;
	        requires = requires ? requires.slice() : [];
	        return { id: id, provides: provides, requires: requires, resolve: resolve, value: null, resolved: false, promise: null };
	    }
	    Private.createProviderEx = createProviderEx;
	    /**
	     * Find a cycle with the given service provider, if one exists.
	     *
	     * @param provider - The service provider to test for a cycle.
	     *
	     * @param map - The mapping of type to extended provider.
	     *
	     * @returns The ordered IDs of the cyclic providers, or null if
	     *   no cycle is present.
	     */
	    function findCycle(provider, map) {
	        if (!provider.requires)
	            return null;
	        var trace = [provider.id];
	        var root = provider.provides;
	        return provider.requires.some(visit) ? trace : null;
	        function visit(kind) {
	            if (kind === root) {
	                return true;
	            }
	            var pex = map.get(kind);
	            if (!pex) {
	                return false;
	            }
	            trace.push(pex.id);
	            if (pex.requires.some(visit)) {
	                return true;
	            }
	            trace.pop();
	            return false;
	        }
	    }
	    Private.findCycle = findCycle;
	    /**
	     * Resolve the instance of the specified service type.
	     *
	     * @param kind - The service type to resolve.
	     *
	     * @param map - The mapping of type to extended provider.
	     *
	     * @param path - An array of provider ids representing the current
	     *   path of the resolver graph. This should be an empty array for
	     *   the first call to this function.
	     *
	     * @returns A promise which resolves to an instance of the requested
	     *   type, or rejects if the instance cannot be created.
	     */
	    function resolveService(kind, map, path) {
	        // Reject the promise if there is no provider for the type.
	        var pex = map.get(kind);
	        if (!pex) {
	            return Promise.reject(missingProviderError(kind, path));
	        }
	        // Resolve immediately if the provider is already resolved.
	        if (pex.resolved) {
	            return Promise.resolve(pex.value);
	        }
	        // Return the pending resolver promise if it exists.
	        if (pex.promise) {
	            return pex.promise;
	        }
	        // Setup the resolver promise for the provider.
	        pex.promise = resolveImpl(pex, map, path).then(function (value) {
	            pex.value = value;
	            pex.promise = null;
	            pex.resolved = true;
	            return value;
	        }, function (error) {
	            pex.promise = null;
	            throw error;
	        });
	        // Return the pending resolver promise.
	        return pex.promise;
	    }
	    Private.resolveService = resolveService;
	    /**
	     * Resolve the service instance for the given provider.
	     */
	    function resolveImpl(pex, map, path) {
	        // Push the current provider id onto the path stack.
	        path.push(pex.id);
	        // Generate the resolver promises from the provider dependencies.
	        var reqs = pex.requires.map(function (kind) { return resolveService(kind, map, path); });
	        // Pop the provider id from the path stack.
	        path.pop();
	        // Return the promise which resolves the type for the provider.
	        return Promise.all(reqs).then(function (deps) { return pex.resolve.apply(void 0, deps); });
	    }
	    /**
	     * Create a formatted error for a missing provider.
	     *
	     * @param kind - The service type which cannot be fulfilled.
	     *
	     * @param path - The resolver path at the point of failure.
	     *
	     * @returns An error with a formatted message.
	     */
	    function missingProviderError(kind, path) {
	        // The `any` cast is needed due to no `Function.name` on IE.
	        var name = kind.name || '';
	        var head = "No registered provider for type: " + name + ".";
	        var tail = "Provider resolution path: " + path.join(' -> ') + ".";
	        return new Error(head + " " + tail);
	    }
	})(Private || (Private = {}));


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	var phosphor_disposable_1 = __webpack_require__(8);
	var phosphor_signaling_1 = __webpack_require__(22);
	/**
	 * An abstract base class which defines a command registry.
	 */
	var ABCCommandRegistry = (function () {
	    function ABCCommandRegistry() {
	    }
	    Object.defineProperty(ABCCommandRegistry.prototype, "commandsAdded", {
	        /**
	         * A signal emitted when commands are added to the registry.
	         */
	        get: function () {
	            return Private.commandsAddedSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ABCCommandRegistry.prototype, "commandsRemoved", {
	        /**
	         * A signal emitted when commands are removed from the registry.
	         */
	        get: function () {
	            return Private.commandsRemovedSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ABCCommandRegistry.prototype, "commandExecuted", {
	        /**
	         * A signal emitted when a command is executed.
	         */
	        get: function () {
	            return Private.commandExecutedSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return ABCCommandRegistry;
	}());
	exports.ABCCommandRegistry = ABCCommandRegistry;
	/**
	 * A concrete implementation of ABCCommandRegistry.
	 */
	var CommandRegistry = (function (_super) {
	    __extends(CommandRegistry, _super);
	    function CommandRegistry() {
	        _super.apply(this, arguments);
	        this._commands = Private.createCommandMap();
	    }
	    /**
	     * List the ids of the currently registered commands.
	     *
	     * @returns A new array of the registered command ids.
	     */
	    CommandRegistry.prototype.list = function () {
	        return Object.keys(this._commands);
	    };
	    /**
	     * Test whether the registry contains a command.
	     *
	     * @param id - The id of the command of interest.
	     *
	     * @returns `true` if the command is registered, `false` otherwise.
	     */
	    CommandRegistry.prototype.has = function (id) {
	        return id in this._commands;
	    };
	    /**
	     * Add commands to the registry.
	     *
	     * @param items - The command items to add to the registry.
	     *
	     * @returns A disposable which will remove the added commands.
	     *
	     * #### Notes
	     * If the `id` for a command is already registered, a warning will be
	     * logged to the console and that specific command will be ignored.
	     */
	    CommandRegistry.prototype.add = function (items) {
	        var _this = this;
	        // Setup the array for the new unique ids.
	        var added = [];
	        // Add the new commands to the map and warn for duplicates.
	        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
	            var _a = items_1[_i], id = _a.id, handler = _a.handler;
	            if (id in this._commands) {
	                console.warn("Command '" + id + "' is already registered.");
	            }
	            else {
	                this._commands[id] = handler;
	                added.push(id);
	            }
	        }
	        // If no items are added, return an empty delegate.
	        if (added.length === 0) {
	            return new phosphor_disposable_1.DisposableDelegate(null);
	        }
	        // Notify for the added commands using a safe shallow copy.
	        this.commandsAdded.emit(added.slice());
	        // Return a delegate which will remove the added commands.
	        return new phosphor_disposable_1.DisposableDelegate(function () {
	            for (var _i = 0, added_1 = added; _i < added_1.length; _i++) {
	                var id = added_1[_i];
	                delete _this._commands[id];
	            }
	            _this.commandsRemoved.emit(added.slice());
	        });
	    };
	    /**
	     * Execute a registered command.
	     *
	     * @param id - The id of the command to execute.
	     *
	     * #### Notes
	     * If the command id is not registered, a warning will be logged.
	     *
	     * If the handler throws an exception, it will be caught and logged.
	     */
	    CommandRegistry.prototype.execute = function (id) {
	        var handler = this._commands[id];
	        if (!handler) {
	            console.warn("command '" + id + "' not registered");
	            return;
	        }
	        try {
	            handler();
	        }
	        catch (err) {
	            console.error("error in command '" + id + "'", err);
	        }
	        this.commandExecuted.emit(id);
	    };
	    return CommandRegistry;
	}(ABCCommandRegistry));
	exports.CommandRegistry = CommandRegistry;
	/**
	 * The default command registry service provider.
	 */
	exports.commandRegistryProvider = {
	    id: 'phosphide.services.commandRegistry',
	    provides: ABCCommandRegistry,
	    resolve: function () { return new CommandRegistry(); },
	};
	/**
	 * The namespace for the private command registry functionality.
	 */
	var Private;
	(function (Private) {
	    /**
	     *
	     */
	    Private.commandsAddedSignal = new phosphor_signaling_1.Signal();
	    /**
	     *
	     */
	    Private.commandsRemovedSignal = new phosphor_signaling_1.Signal();
	    /**
	     *
	     */
	    Private.commandExecutedSignal = new phosphor_signaling_1.Signal();
	    /**
	     *
	     */
	    function createCommandMap() {
	        return Object.create(null);
	    }
	    Private.createCommandMap = createCommandMap;
	})(Private || (Private = {}));


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	var phosphor_commandpalette_1 = __webpack_require__(54);
	var phosphor_disposable_1 = __webpack_require__(8);
	var phosphor_signaling_1 = __webpack_require__(22);
	var commandregistry_1 = __webpack_require__(52);
	var shortcutregistry_1 = __webpack_require__(61);
	/**
	 *
	 */
	var ABCPaletteRegistry = (function () {
	    function ABCPaletteRegistry() {
	    }
	    Object.defineProperty(ABCPaletteRegistry.prototype, "commandTriggered", {
	        /**
	         * A signal emitted when a command is triggered by the palette.
	         */
	        get: function () {
	            return Private.commandTriggeredSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ABCPaletteRegistry.prototype, "model", {
	        /**
	         *
	         */
	        get: function () {
	            return this.getModel();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return ABCPaletteRegistry;
	}());
	exports.ABCPaletteRegistry = ABCPaletteRegistry;
	/**
	 *
	 */
	var PaletteRegistry = (function (_super) {
	    __extends(PaletteRegistry, _super);
	    /**
	     *
	     */
	    function PaletteRegistry(commands, shortcuts) {
	        var _this = this;
	        _super.call(this);
	        /**
	         * The private command handler function.
	         */
	        this._executeCommand = function (id) {
	            _this.commandTriggered.emit(id);
	            _this._commands.execute(id);
	        };
	        this._model = new phosphor_commandpalette_1.StandardPaletteModel();
	        this._boxes = [];
	        this._commands = commands;
	        this._shortcuts = shortcuts;
	        this._shortcuts.shortcutsAdded.connect(this._onShortcutsChanged, this);
	        this._shortcuts.shortcutsRemoved.connect(this._onShortcutsChanged, this);
	    }
	    /**
	     * Add command palette items to the palette registry.
	     *
	     * @param items - The array of items to add to the registry.
	     *
	     * @returns A disposable which will remove the added items.
	     */
	    PaletteRegistry.prototype.add = function (items) {
	        var _this = this;
	        var optionsArray = items.map(function (item) {
	            // let commandExists = this._commandRegistry.has(item.id);
	            // if (!commandExists) return null;
	            var seq = _this._shortcuts.sequenceFor(item.command);
	            var shortcut = seq ? Private.formatSequence(seq) : '';
	            var options = {
	                handler: _this._executeCommand,
	                args: item.command,
	                text: item.text,
	                shortcut: shortcut,
	                icon: item.icon || '',
	                caption: item.caption || '',
	                category: item.category || ''
	            };
	            return options;
	        });
	        if (optionsArray.length === 0) {
	            return new phosphor_disposable_1.DisposableDelegate(null);
	        }
	        var boxes = this._model.addItems(optionsArray).map(function (item) { return ({ item: item }); });
	        Array.prototype.push.apply(this._boxes, boxes);
	        return new phosphor_disposable_1.DisposableDelegate(function () {
	            _this._model.removeItems(boxes.map(function (box) { return box.item; }));
	            _this._boxes = _this._boxes.filter(function (box) { return boxes.indexOf(box) === -1; });
	        });
	    };
	    /**
	     *
	     */
	    PaletteRegistry.prototype.getModel = function () {
	        return this._model;
	    };
	    /**
	     * Update the shortcut for the given item pair.
	     */
	    PaletteRegistry.prototype._updateShortcut = function (box) {
	        var seq = this._shortcuts.sequenceFor(box.item.args);
	        var shortcut = seq ? Private.formatSequence(seq) : '';
	        var options = {
	            handler: this._executeCommand,
	            args: box.item.args,
	            text: box.item.text,
	            shortcut: shortcut,
	            icon: box.item.icon,
	            caption: box.item.caption,
	            category: box.item.category
	        };
	        this._model.removeItem(box.item);
	        box.item = this._model.addItem(options);
	    };
	    /**
	     * A handler for shortcut registry signals.
	     */
	    PaletteRegistry.prototype._onShortcutsChanged = function (sender, commands) {
	        var changed = Object.create(null);
	        commands.forEach(function (id) { changed[id] = true; });
	        for (var _i = 0, _a = this._boxes; _i < _a.length; _i++) {
	            var box = _a[_i];
	            var relevant = box.item.args in changed;
	            if (relevant)
	                this._updateShortcut(box);
	        }
	    };
	    return PaletteRegistry;
	}(ABCPaletteRegistry));
	exports.PaletteRegistry = PaletteRegistry;
	/**
	 * The default palette registry service provider.
	 */
	exports.paletteRegistryProvider = {
	    id: 'phosphide.services.paletteRegistry',
	    provides: ABCPaletteRegistry,
	    requires: [commandregistry_1.ABCCommandRegistry, shortcutregistry_1.ABCShortcutRegistry],
	    resolve: function (commands, shortcuts) {
	        return new PaletteRegistry(commands, shortcuts);
	    },
	};
	/**
	 *
	 */
	var Private;
	(function (Private) {
	    /**
	     * A signal emitted when a command is triggered by the palette.
	     */
	    Private.commandTriggeredSignal = new phosphor_signaling_1.Signal();
	    /**
	     * A flag indicating whether the platform is Mac.
	     */
	    var IS_MAC = !!navigator.platform.match(/Mac/i);
	    /**
	     * How to format Accel (Cmd on Mac, Ctrl elsewhere)
	     */
	    var ACCEL = IS_MAC ? 'Cmd' : 'Ctrl';
	    /**
	     *
	     */
	    function formatSequence(seq) {
	        return seq.map(function (s) { return s.trim().replace(/\s+/g, '-').replace('Accel', ACCEL); }).join(' ');
	    }
	    Private.formatSequence = formatSequence;
	})(Private || (Private = {}));


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(55));
	__export(__webpack_require__(56));
	__export(__webpack_require__(57));
	__export(__webpack_require__(58));
	__webpack_require__(59);


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var phosphor_signaling_1 = __webpack_require__(22);
	/**
	 * An enum of the support search result types.
	 */
	(function (SearchResultType) {
	    /**
	     * The search result represents a section header.
	     */
	    SearchResultType[SearchResultType["Header"] = 0] = "Header";
	    /**
	     * The search result represents a command.
	     */
	    SearchResultType[SearchResultType["Command"] = 1] = "Command";
	})(exports.SearchResultType || (exports.SearchResultType = {}));
	var SearchResultType = exports.SearchResultType;
	/**
	 * An abstract base class for creating command palette models.
	 */
	var AbstractPaletteModel = (function () {
	    function AbstractPaletteModel() {
	    }
	    Object.defineProperty(AbstractPaletteModel.prototype, "changed", {
	        /**
	         * A signal emitted when the potential search results change.
	         *
	         * #### Notes
	         * A subclass should emit this signal when its contents change in
	         * a way which may invalidate previously computed search results.
	         */
	        get: function () {
	            return AbstractPaletteModelPrivate.changedSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return AbstractPaletteModel;
	})();
	exports.AbstractPaletteModel = AbstractPaletteModel;
	/**
	 * The namespace for the `AbstractPaletteModel` private data.
	 */
	var AbstractPaletteModelPrivate;
	(function (AbstractPaletteModelPrivate) {
	    /**
	     * A signal emitted when a palette model's search results change.
	     */
	    AbstractPaletteModelPrivate.changedSignal = new phosphor_signaling_1.Signal();
	})(AbstractPaletteModelPrivate || (AbstractPaletteModelPrivate = {}));


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var arrays = __webpack_require__(3);
	var phosphor_widget_1 = __webpack_require__(20);
	var abstractmodel_1 = __webpack_require__(55);
	/**
	 * The class name added to `CommandPalette` instances.
	 */
	var PALETTE_CLASS = 'p-CommandPalette';
	/**
	 * The class name added to the search section of the palette.
	 */
	var SEARCH_CLASS = 'p-CommandPalette-search';
	/**
	 * The class name added to the input wrapper in the search section.
	 */
	var WRAPPER_CLASS = 'p-CommandPalette-inputWrapper';
	/**
	 * The class name added to the input node in the search section.
	 */
	var INPUT_CLASS = 'p-CommandPalette-input';
	/**
	 * The class name added to the content section of the palette.
	 */
	var CONTENT_CLASS = 'p-CommandPalette-content';
	/**
	 * The class name added to a palette section header.
	 */
	var HEADER_CLASS = 'p-CommandPalette-header';
	/**
	 * The class name added to a palette command.
	 */
	var COMMAND_CLASS = 'p-CommandPalette-command';
	/**
	 * The class name added to the command content node.
	 */
	var COMMAND_CONTENT_CLASS = 'p-CommandPalette-commandContent';
	/**
	 * The class name added to a command icon node.
	 */
	var COMMAND_ICON_CLASS = 'p-CommandPalette-commandIcon';
	/**
	 * The class name added to a command text node.
	 */
	var COMMAND_TEXT_CLASS = 'p-CommandPalette-commandText';
	/**
	 * The class name added to a command shortcut node.
	 */
	var COMMAND_SHORTCUT_CLASS = 'p-CommandPalette-commandShortcut';
	/**
	 * The class name added to a command caption node.
	 */
	var COMMAND_CAPTION_CLASS = 'p-CommandPalette-commandCaption';
	/**
	 * The class name added to the active palette header or command.
	 */
	var ACTIVE_CLASS = 'p-mod-active';
	/**
	 * An enum of command palette activation targets.
	 */
	(function (ActivationTarget) {
	    /**
	     * The activation target is a header item.
	     */
	    ActivationTarget[ActivationTarget["Header"] = 0] = "Header";
	    /**
	     * The activation target is a command item.
	     */
	    ActivationTarget[ActivationTarget["Command"] = 1] = "Command";
	    /**
	     * The activate target is any item.
	     */
	    ActivationTarget[ActivationTarget["Any"] = 2] = "Any";
	})(exports.ActivationTarget || (exports.ActivationTarget = {}));
	var ActivationTarget = exports.ActivationTarget;
	/**
	 * A widget which displays commands from a command source.
	 */
	var CommandPalette = (function (_super) {
	    __extends(CommandPalette, _super);
	    /**
	     * Construct a new command palette.
	     */
	    function CommandPalette() {
	        _super.call(this);
	        this._activeIndex = -1;
	        this._results = [];
	        this._headerPool = [];
	        this._commandPool = [];
	        this._model = null;
	        this.addClass(PALETTE_CLASS);
	    }
	    /**
	     * Create the DOM node for a command palette.
	     */
	    CommandPalette.createNode = function () {
	        var node = document.createElement('div');
	        var search = document.createElement('div');
	        var wrapper = document.createElement('div');
	        var input = document.createElement('input');
	        var content = document.createElement('ul');
	        search.className = SEARCH_CLASS;
	        wrapper.className = WRAPPER_CLASS;
	        input.className = INPUT_CLASS;
	        content.className = CONTENT_CLASS;
	        input.spellcheck = false;
	        wrapper.appendChild(input);
	        search.appendChild(wrapper);
	        node.appendChild(search);
	        node.appendChild(content);
	        return node;
	    };
	    /**
	     * Create a new header node for a command palette.
	     *
	     * @returns A new DOM node for a palette section header.
	     *
	     * #### Notes
	     * This method may be reimplemented to create custom headers.
	     */
	    CommandPalette.createHeaderNode = function () {
	        var node = document.createElement('li');
	        node.className = HEADER_CLASS;
	        return node;
	    };
	    /**
	     * Create a new command node for a command palette.
	     *
	     * @returns A new DOM node for a palette section command.
	     *
	     * #### Notes
	     * This method may be reimplemented to create custom items.
	     */
	    CommandPalette.createCommandNode = function () {
	        var node = document.createElement('li');
	        var content = document.createElement('div');
	        var icon = document.createElement('span');
	        var text = document.createElement('span');
	        var caption = document.createElement('span');
	        var shortcut = document.createElement('span');
	        node.className = COMMAND_CLASS;
	        content.className = COMMAND_CONTENT_CLASS;
	        icon.className = COMMAND_ICON_CLASS;
	        text.className = COMMAND_TEXT_CLASS;
	        caption.className = COMMAND_CAPTION_CLASS;
	        shortcut.className = COMMAND_SHORTCUT_CLASS;
	        content.appendChild(shortcut);
	        content.appendChild(text);
	        content.appendChild(caption);
	        node.appendChild(icon);
	        node.appendChild(content);
	        return node;
	    };
	    /**
	     * Update a header node to reflect the given data.
	     *
	     * @param node - The header node which should be updated.
	     *
	     * @param data - The data object to use for the node state.
	     *
	     * #### Notes
	     * This is called automatically when the node should be updated.
	     *
	     * If the [[createHeaderNode]] method is reimplemented, this method
	     * should also be reimplemented so that the node state is properly
	     * updated.
	     */
	    CommandPalette.updateHeaderNode = function (node, data) {
	        node.className = HEADER_CLASS;
	        node.innerHTML = data.text;
	    };
	    /**
	     * Update a command node to reflect the given data.
	     *
	     * @param node - The command node which should be updated.
	     *
	     * @param data - The data object to use for the node state.
	     *
	     * #### Notes
	     * This is called automatically when the node should be updated.
	     *
	     * If the [[createHeaderNode]] method is reimplemented, this method
	     * should also be reimplemented so that the node state is properly
	     * updated.
	     */
	    CommandPalette.updateCommandNode = function (node, data) {
	        var icon = node.firstChild;
	        var content = icon.nextSibling;
	        var shortcut = content.firstChild;
	        var text = shortcut.nextSibling;
	        var caption = text.nextSibling;
	        var itemClass = COMMAND_CLASS;
	        if (data.className)
	            itemClass += ' ' + data.className;
	        node.className = itemClass;
	        var iconClass = COMMAND_ICON_CLASS;
	        if (data.icon)
	            iconClass += ' ' + data.icon;
	        icon.className = iconClass;
	        text.innerHTML = data.text;
	        caption.innerHTML = data.caption;
	        shortcut.innerHTML = data.shortcut;
	    };
	    /**
	     * Dispose of the resources held by the command palette.
	     */
	    CommandPalette.prototype.dispose = function () {
	        this._model = null;
	        this._results.length = 0;
	        this._headerPool.length = 0;
	        this._commandPool.length = 0;
	        _super.prototype.dispose.call(this);
	    };
	    Object.defineProperty(CommandPalette.prototype, "model", {
	        /**
	         * Get the model for the command palette.
	         */
	        get: function () {
	            return this._model;
	        },
	        /**
	         * Set the model for the command palette.
	         */
	        set: function (value) {
	            value = value || null;
	            if (this._model === value) {
	                return;
	            }
	            if (this._model) {
	                this._model.changed.disconnect(this._onModelChanged, this);
	            }
	            if (value) {
	                value.changed.connect(this._onModelChanged, this);
	            }
	            this._model = value;
	            this._results.length = 0;
	            this.update();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(CommandPalette.prototype, "contentNode", {
	        /**
	         * Get the command palette content node.
	         *
	         * #### Notes
	         * This is the node which holds the command palette item nodes.
	         *
	         * Modifying this node directly can lead to undefined behavior.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this.node.getElementsByClassName(CONTENT_CLASS)[0];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(CommandPalette.prototype, "inputNode", {
	        /**
	         * Get the command palette input node.
	         *
	         * #### Notes
	         * This node can be used to trigger manual updates of the command
	         * palette. Simply set the input node `value` to the desired text
	         * and call `palette.update()`.
	         *
	         * This is a read-only property.
	         */
	        get: function () {
	            return this.node.getElementsByTagName('input')[0];
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Activate the first matching target item in the palette.
	     *
	     * @param target - The activation target. The default is `Any`.
	     *
	     * #### Notes
	     * This automatically scrolls the item into view.
	     *
	     * If no matching item is found, no item is activated.
	     */
	    CommandPalette.prototype.activateFirst = function (target) {
	        if (target === void 0) { target = ActivationTarget.Any; }
	        var i;
	        if (target === ActivationTarget.Header) {
	            var type = abstractmodel_1.SearchResultType.Header;
	            i = arrays.findIndex(this._results, function (r) { return r.type === type; });
	        }
	        else if (target === ActivationTarget.Command) {
	            var type = abstractmodel_1.SearchResultType.Command;
	            i = arrays.findIndex(this._results, function (r) { return r.type === type; });
	        }
	        else {
	            i = 0;
	        }
	        this._activate(i);
	    };
	    /**
	     * Activate the last matching target item in the palette.
	     *
	     * @param target - The activation target. The default is `Any`.
	     *
	     * #### Notes
	     * This automatically scrolls the item into view.
	     *
	     * If no matching item is found, no item is activated.
	     */
	    CommandPalette.prototype.activateLast = function (target) {
	        if (target === void 0) { target = ActivationTarget.Any; }
	        var i;
	        if (target === ActivationTarget.Header) {
	            var type = abstractmodel_1.SearchResultType.Header;
	            i = arrays.rfindIndex(this._results, function (r) { return r.type === type; });
	        }
	        else if (target === ActivationTarget.Command) {
	            var type = abstractmodel_1.SearchResultType.Command;
	            i = arrays.rfindIndex(this._results, function (r) { return r.type === type; });
	        }
	        else {
	            i = this._results.length - 1;
	        }
	        this._activate(i);
	    };
	    /**
	     * Activate the next matching target item in the palette.
	     *
	     * @param target - The activation target. The default is `Any`.
	     *
	     * #### Notes
	     * This automatically scrolls the item into view.
	     *
	     * The search will wrap around at the end of the palette.
	     *
	     * If no matching item is found, no item is activated.
	     */
	    CommandPalette.prototype.activateNext = function (target) {
	        if (target === void 0) { target = ActivationTarget.Any; }
	        var i;
	        var k = this._activeIndex + 1;
	        var j = k >= this._results.length ? 0 : k;
	        if (target === ActivationTarget.Header) {
	            var type = abstractmodel_1.SearchResultType.Header;
	            i = arrays.findIndex(this._results, function (r) { return r.type === type; }, j, true);
	        }
	        else if (target === ActivationTarget.Command) {
	            var type = abstractmodel_1.SearchResultType.Command;
	            i = arrays.findIndex(this._results, function (r) { return r.type === type; }, j, true);
	        }
	        else {
	            i = j;
	        }
	        this._activate(i);
	    };
	    /**
	     * Activate the previous matching target item in the palette.
	     *
	     * @param target - The activation target. The default is `Any`.
	     *
	     * #### Notes
	     * This automatically scrolls the item into view.
	     *
	     * The search will wrap around at the end of the palette.
	     *
	     * If no matching item is found, no item is activated.
	     */
	    CommandPalette.prototype.activatePrevious = function (target) {
	        if (target === void 0) { target = ActivationTarget.Any; }
	        var i;
	        var k = this._activeIndex;
	        var j = k <= 0 ? this._results.length - 1 : k - 1;
	        if (target === ActivationTarget.Header) {
	            var type = abstractmodel_1.SearchResultType.Header;
	            i = arrays.rfindIndex(this._results, function (r) { return r.type === type; }, j, true);
	        }
	        else if (target === ActivationTarget.Command) {
	            var type = abstractmodel_1.SearchResultType.Command;
	            i = arrays.rfindIndex(this._results, function (r) { return r.type === type; }, j, true);
	        }
	        else {
	            i = j;
	        }
	        this._activate(i);
	    };
	    /**
	     * Trigger the currently active item in the palette.
	     *
	     * #### Notes
	     * If the active item is a header, the search results are refined
	     * using the category of the header. If the current category is
	     * the same as the header category, the category will be removed.
	     *
	     * If the active item is a command, the command handler will be
	     * invoked and the current query text will be selected.
	     *
	     * If there is no active item, this is a no-op.
	     */
	    CommandPalette.prototype.triggerActive = function () {
	        var result = this._results[this._activeIndex];
	        if (!result) {
	            return;
	        }
	        if (result.type === abstractmodel_1.SearchResultType.Header) {
	            var input = this.inputNode;
	            var _a = CommandPalette.splitQuery(input.value), category = _a.category, text = _a.text;
	            var desired = result.value.category.trim();
	            var computed = desired === category ? '' : desired;
	            var query = CommandPalette.joinQuery(computed, text);
	            input.value = query;
	            input.focus();
	            this.update();
	        }
	        else if (result.type === abstractmodel_1.SearchResultType.Command) {
	            var _b = result.value, handler = _b.handler, args = _b.args;
	            this.inputNode.select();
	            handler(args);
	        }
	    };
	    /**
	     * Handle the DOM events for the command palette.
	     *
	     * @param event - The DOM event sent to the command palette.
	     *
	     * #### Notes
	     * This method implements the DOM `EventListener` interface and is
	     * called in response to events on the command palette's DOM node.
	     * It should not be called directly by user code.
	     */
	    CommandPalette.prototype.handleEvent = function (event) {
	        switch (event.type) {
	            case 'click':
	                this._evtClick(event);
	                break;
	            case 'keydown':
	                this._evtKeyDown(event);
	                break;
	            case 'input':
	                this.update();
	                break;
	        }
	    };
	    /**
	     * A message handler invoked on a `'after-attach'` message.
	     */
	    CommandPalette.prototype.onAfterAttach = function (msg) {
	        this.node.addEventListener('click', this);
	        this.node.addEventListener('keydown', this);
	        this.node.addEventListener('input', this);
	    };
	    /**
	     * A message handler invoked on a `'before-detach'` message.
	     */
	    CommandPalette.prototype.onBeforeDetach = function (msg) {
	        this.node.removeEventListener('click', this);
	        this.node.removeEventListener('keydown', this);
	        this.node.removeEventListener('input', this);
	    };
	    /**
	     * A message handler invoked on an `'update-request'` message.
	     */
	    CommandPalette.prototype.onUpdateRequest = function (msg) {
	        // Clear the current content.
	        var content = this.contentNode;
	        content.textContent = '';
	        // Reset the active index.
	        this._activeIndex = -1;
	        // Bail early if there is no model.
	        if (!this._model) {
	            return;
	        }
	        // Split the query text into its category and text parts.
	        var _a = CommandPalette.splitQuery(this.inputNode.value), category = _a.category, text = _a.text;
	        // Search for query matches and store the results for later use.
	        var results = this._results = this._model.search(category, text);
	        // If the results are empty, there is nothing left to do.
	        if (results.length === 0) {
	            return;
	        }
	        // Grab the derived class type for access to the render methods.
	        var ctor = this.constructor;
	        // Setup the header node render function.
	        var headerPoolIndex = 0;
	        var headerPool = this._headerPool;
	        var renderHeader = function (data) {
	            var node = headerPool[headerPoolIndex++];
	            if (!node) {
	                node = ctor.createHeaderNode();
	                headerPool.push(node);
	            }
	            ctor.updateHeaderNode(node, data);
	            return node;
	        };
	        // Setup the command node render function.
	        var commandPoolIndex = 0;
	        var commandPool = this._commandPool;
	        var renderCommand = function (data) {
	            var node = commandPool[commandPoolIndex++];
	            if (!node) {
	                node = ctor.createCommandNode();
	                commandPool.push(node);
	            }
	            ctor.updateCommandNode(node, data);
	            return node;
	        };
	        // Loop over the search results and render the nodes.
	        var fragment = document.createDocumentFragment();
	        for (var _i = 0; _i < results.length; _i++) {
	            var _b = results[_i], type = _b.type, value = _b.value;
	            if (type === abstractmodel_1.SearchResultType.Header) {
	                fragment.appendChild(renderHeader(value));
	            }
	            else if (type === abstractmodel_1.SearchResultType.Command) {
	                fragment.appendChild(renderCommand(value));
	            }
	            else {
	                throw new Error('invalid search result type');
	            }
	        }
	        // Update the content node with the rendered search results.
	        content.appendChild(fragment);
	        // If there is query text, highlight the first command item.
	        // Otherwise, reset the content scroll position to the top.
	        if (category || text) {
	            this.activateFirst(ActivationTarget.Command);
	        }
	        else {
	            requestAnimationFrame(function () { content.scrollTop = 0; });
	        }
	    };
	    /**
	     * Activate the node at the given index.
	     *
	     * If the node is scrolled out of view, it will be scrolled into
	     * view and aligned according to the `alignTop` parameter.
	     */
	    CommandPalette.prototype._activate = function (index) {
	        var content = this.contentNode;
	        var children = content.children;
	        if (index < 0 || index >= children.length) {
	            index = -1;
	        }
	        if (this._activeIndex === index) {
	            return;
	        }
	        var oldNode = children[this._activeIndex];
	        var newNode = children[index];
	        this._activeIndex = index;
	        if (oldNode)
	            oldNode.classList.remove(ACTIVE_CLASS);
	        if (newNode)
	            newNode.classList.add(ACTIVE_CLASS);
	        if (newNode)
	            requestAnimationFrame(function () {
	                Private.scrollIfNeeded(content, newNode);
	            });
	    };
	    /**
	     * Handle the `'click'` event for the command palette.
	     */
	    CommandPalette.prototype._evtClick = function (event) {
	        if (event.button !== 0) {
	            return;
	        }
	        event.preventDefault();
	        event.stopPropagation();
	        var root = this.node;
	        var content = this.contentNode;
	        var target = event.target;
	        while (true) {
	            if (target === root)
	                return;
	            var parent_1 = target.parentNode;
	            if (parent_1 === content)
	                break;
	            target = parent_1;
	        }
	        var index = Array.prototype.indexOf.call(content.children, target);
	        this._activate(index);
	        this.triggerActive();
	    };
	    /**
	     * Handle the `'keydown'` event for the command palette.
	     */
	    CommandPalette.prototype._evtKeyDown = function (event) {
	        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
	            return;
	        }
	        switch (event.keyCode) {
	            case 13:
	                event.preventDefault();
	                event.stopPropagation();
	                this.triggerActive();
	                break;
	            case 38:
	                event.preventDefault();
	                event.stopPropagation();
	                this.activatePrevious();
	                break;
	            case 40:
	                event.preventDefault();
	                event.stopPropagation();
	                this.activateNext();
	                break;
	        }
	    };
	    /**
	     * Handle the `changed` signal for the palette model.
	     */
	    CommandPalette.prototype._onModelChanged = function () {
	        this.update();
	    };
	    return CommandPalette;
	})(phosphor_widget_1.Widget);
	exports.CommandPalette = CommandPalette;
	/**
	 * The namespace for the `CommandPalette` class statics.
	 */
	var CommandPalette;
	(function (CommandPalette) {
	    /**
	     * Split a query string into its category and text components.
	     *
	     * @param query - A query string of the form `(:<category>:)?<text>`.
	     *
	     * @returns The `category` and `text` components of the query with
	     *   leading and trailing whitespace removed.
	     */
	    function splitQuery(query) {
	        query = query.trim();
	        if (query[0] !== ':') {
	            return { category: '', text: query };
	        }
	        var i = query.indexOf(':', 1);
	        if (i === -1) {
	            return { category: query.slice(1).trim(), text: '' };
	        }
	        var category = query.slice(1, i).trim();
	        var text = query.slice(i + 1).trim();
	        return { category: category, text: text };
	    }
	    CommandPalette.splitQuery = splitQuery;
	    /**
	     * Join category and text components into a query string.
	     *
	     * @param category - The category for the query or an empty string.
	     *
	     * @param text - The text for the query or an empty string.
	     *
	     * @returns The joined query string for the components.
	     */
	    function joinQuery(category, text) {
	        var query;
	        if (category && text) {
	            query = ":" + category.trim() + ": " + text.trim();
	        }
	        else if (category) {
	            query = ":" + category.trim() + ": ";
	        }
	        else if (text) {
	            query = text.trim();
	        }
	        else {
	            query = '';
	        }
	        return query;
	    }
	    CommandPalette.joinQuery = joinQuery;
	})(CommandPalette = exports.CommandPalette || (exports.CommandPalette = {}));
	/**
	 * The namespace for the `CommandPalette` private data.
	 */
	var Private;
	(function (Private) {
	    /**
	     * Scroll an element into view if needed.
	     *
	     * @param area - The scroll area element.
	     *
	     * @param elem - The element of interest.
	     */
	    function scrollIfNeeded(area, elem) {
	        var ar = area.getBoundingClientRect();
	        var er = elem.getBoundingClientRect();
	        if (er.top < ar.top) {
	            area.scrollTop -= ar.top - er.top;
	        }
	        else if (er.bottom > ar.bottom) {
	            area.scrollTop += er.bottom - ar.bottom;
	        }
	    }
	    Private.scrollIfNeeded = scrollIfNeeded;
	})(Private || (Private = {}));


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var arrays = __webpack_require__(3);
	var abstractmodel_1 = __webpack_require__(55);
	var stringsearch_1 = __webpack_require__(58);
	/**
	 * An object for use with a standard palette model.
	 *
	 * #### Notes
	 * Instances of this class will not typically be created directly by
	 * the user. A palette model will create and return instances of the
	 * class from its adder methods.
	 */
	var StandardPaletteItem = (function () {
	    /**
	     * Construct a new standard palette item.
	     *
	     * @param options - The options for initializing the item.
	     */
	    function StandardPaletteItem(options) {
	        this._text = options.text;
	        this._args = options.args;
	        this._handler = options.handler;
	        this._icon = options.icon || '';
	        this._caption = options.caption || '';
	        this._shortcut = options.shortcut || '';
	        this._className = options.className || '';
	        this._category = Private.normalizeCategory(options.category || '');
	    }
	    Object.defineProperty(StandardPaletteItem.prototype, "text", {
	        /**
	         * Get the primary text for the item.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._text;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(StandardPaletteItem.prototype, "icon", {
	        /**
	         * Get the icon class name(s) for the item.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._icon;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(StandardPaletteItem.prototype, "caption", {
	        /**
	         * Get the descriptive caption for the item.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._caption;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(StandardPaletteItem.prototype, "shortcut", {
	        /**
	         * Get the keyboard shortcut for the item.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._shortcut;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(StandardPaletteItem.prototype, "category", {
	        /**
	         * Get the category name for the item.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._category;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(StandardPaletteItem.prototype, "className", {
	        /**
	         * Get the extra class name(s) for the item.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._className;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(StandardPaletteItem.prototype, "handler", {
	        /**
	         * Get the handler function for the item.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._handler;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(StandardPaletteItem.prototype, "args", {
	        /**
	         * Get the arguments for the handler.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._args;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return StandardPaletteItem;
	})();
	exports.StandardPaletteItem = StandardPaletteItem;
	/**
	 * A concrete palette model which holds a collection of palette items.
	 *
	 * #### Notes
	 * This class is a reasonable option for populating command palettes
	 * when the number of items is reasonable, and when the items can be
	 * created ahead of time. If lazy searching of a large data set is
	 * required, then a custom palette model should be used instead.
	 */
	var StandardPaletteModel = (function (_super) {
	    __extends(StandardPaletteModel, _super);
	    function StandardPaletteModel() {
	        _super.apply(this, arguments);
	        this._items = [];
	    }
	    /**
	     * Get the items contained in the palette model.
	     *
	     * @returns A new array of the current items in the model.
	     */
	    StandardPaletteModel.prototype.items = function () {
	        return this._items.slice();
	    };
	    /**
	     * Add a new palette item to the model.
	     *
	     * @param options - The options for initializing the item.
	     *
	     * @returns The palette item which was added to the model.
	     */
	    StandardPaletteModel.prototype.addItem = function (options) {
	        var item = new StandardPaletteItem(options);
	        this._items.push(item);
	        this.changed.emit(void 0);
	        return item;
	    };
	    /**
	     * Add several new palette items to the model.
	     *
	     * @param options - The options for initializing the items.
	     *
	     * @returns The new palette items where were added to the model.
	     */
	    StandardPaletteModel.prototype.addItems = function (options) {
	        var items = options.map(function (opts) { return new StandardPaletteItem(opts); });
	        Array.prototype.push.apply(this._items, items);
	        this.changed.emit(void 0);
	        return items;
	    };
	    /**
	     * Remove a palette item from the model.
	     *
	     * @param item - The item to remove from the model.
	     *
	     * #### Notes
	     * If the item is not contained in the model, this is a no-op.
	     */
	    StandardPaletteModel.prototype.removeItem = function (item) {
	        var i = arrays.remove(this._items, item);
	        if (i !== -1)
	            this.changed.emit(void 0);
	    };
	    /**
	     * Remove several items from the model.
	     *
	     * @param items - The items to remove from the model.
	     *
	     * #### Notes
	     * Items which are no contained in the model are ignored.
	     */
	    StandardPaletteModel.prototype.removeItems = function (items) {
	        var rest = this._items.filter(function (other) { return items.indexOf(other) === -1; });
	        if (rest.length === this._items.length) {
	            return;
	        }
	        this._items = rest;
	        this.changed.emit(void 0);
	    };
	    /**
	     * Remove all items from the model.
	     */
	    StandardPaletteModel.prototype.clearItems = function () {
	        if (this._items.length === 0) {
	            return;
	        }
	        this._items.length = 0;
	        this.changed.emit(void 0);
	    };
	    /**
	     * Search the palette model for matching commands.
	     *
	     * @param category - The category match against the model items. If
	     *   this is an empty string, all item categories will be matched.
	     *
	     * @param text - The text to match against the model items. If this
	     *   is an empty string, all items will be matched.
	     *
	     * @returns An array of new search results for the query.
	     */
	    StandardPaletteModel.prototype.search = function (category, text) {
	        // Collect a mapping of the matching categories. The mapping will
	        // only contain categories which match the provided query text.
	        // If the category is an empty string, all categories will be
	        // matched with a score of `0` and a `null` indices array.
	        var catmap = Private.matchCategory(this._items, category);
	        // Filter the items for matching text. Only items which have a
	        // category in the given map are considered. The category score
	        // is added to the text score to create the final item score.
	        // If the text is an empty string, all items will be matched
	        // will a text score of `0` and `null` indices array.
	        var scores = Private.matchText(this._items, text, catmap);
	        // Sort the items based on their total item score. Ties are
	        // broken by locale ordering the category followed by the text.
	        scores.sort(Private.scoreCmp);
	        // Group the item scores by category. The categories are added
	        // to the map in the order they appear in the scores array.
	        var groups = Private.groupScores(scores);
	        // Return the results for the search. The headers are created in
	        // the order of key iteration of the map. On major browsers, this
	        // is insertion order. This means that headers are created in the
	        // order of first appearance in the sorted scores array.
	        return Private.createSearchResults(groups, catmap);
	    };
	    return StandardPaletteModel;
	})(abstractmodel_1.AbstractPaletteModel);
	exports.StandardPaletteModel = StandardPaletteModel;
	/**
	 * The namespace for the `StandardPaletteModel` private data.
	 */
	var Private;
	(function (Private) {
	    /**
	     * Normalize a category for a palette item.
	     *
	     * @param category - The item category to normalize.
	     *
	     * @returns The normalized category text.
	     *
	     * #### Notes
	     * This converts the category to lower case and removes any
	     * extraneous whitespace.
	     */
	    function normalizeCategory(category) {
	        return category.trim().replace(/\s+/g, ' ').toLowerCase();
	    }
	    Private.normalizeCategory = normalizeCategory;
	    /**
	     * Collect a mapping of the categories which match the given query.
	     *
	     * @param items - The palette items to search.
	     *
	     * @param query - The category portion of the palette model query.
	     *
	     * @returns A mapping of matched category to match score.
	     *
	     * #### Notes
	     * The query string will be normalized by lower casing and removing
	     * all whitespace. If the normalized query is an empty string, all
	     * categories will be matched with a `0` score and `null` indices.
	     */
	    function matchCategory(items, query) {
	        // Normalize the query text to lower case with no whitespace.
	        query = normalizeQueryText(query);
	        // Create the maps needed to track the match state.
	        var seen = Object.create(null);
	        var matched = Object.create(null);
	        // Iterate over the items and match the categories.
	        for (var _i = 0; _i < items.length; _i++) {
	            var category = items[_i].category;
	            // If a category has already been seen, no more work is needed.
	            if (category in seen) {
	                continue;
	            }
	            // Mark the category as seen so it is only processed once.
	            seen[category] = true;
	            // If the query is empty, all categories match by default.
	            if (!query) {
	                matched[category] = { score: 0, indices: null };
	                continue;
	            }
	            // Run the matcher for the query and skip if no match.
	            var match = stringsearch_1.StringSearch.sumOfSquares(category, query);
	            if (!match) {
	                continue;
	            }
	            // Store the match score in the results.
	            matched[category] = match;
	        }
	        // Return the final mapping of matched categories.
	        return matched;
	    }
	    Private.matchCategory = matchCategory;
	    /**
	     * Filter palette items for those with matching text and category.
	     *
	     * @param items - The palette items to search.
	     *
	     * @param query - The text portion of the palette model query.
	     *
	     * @param categories - A mapping of the valid item categories.
	     *
	     * @returns An array of item scores for the matching items.
	     *
	     * #### Notes
	     * The query string will be normalized by lower casing and removing
	     * all whitespace. If the normalized query is an empty string, all
	     * items will be matched with a `0` text score and `null` indices.
	     *
	     * Items which have a category which is not present in the category
	     * map will be ignored.
	     *
	     * The final item score is the sum of the item text score and the
	     * relevant category score.
	     *
	     * This function does not sort the results.
	     */
	    function matchText(items, query, categories) {
	        // Normalize the query text to lower case with no whitespace.
	        query = normalizeQueryText(query);
	        // Create the array to hold the resulting scores.
	        var scores = [];
	        // Iterate over the items and match the text with the query.
	        for (var _i = 0; _i < items.length; _i++) {
	            var item = items[_i];
	            // Lookup the category score for the item category.
	            var cs = categories[item.category];
	            // If the category was not matched, the item is skipped.
	            if (!cs) {
	                continue;
	            }
	            // If the query is empty, all items are matched by default.
	            if (!query) {
	                scores.push({ score: cs.score, indices: null, item: item });
	                continue;
	            }
	            // Run the matcher for the query and skip if no match.
	            var match = stringsearch_1.StringSearch.sumOfSquares(item.text.toLowerCase(), query);
	            if (!match) {
	                continue;
	            }
	            // Create the match score for the item.
	            var score = cs.score + match.score;
	            scores.push({ score: score, indices: match.indices, item: item });
	        }
	        // Return the final array of matched item scores.
	        return scores;
	    }
	    Private.matchText = matchText;
	    /**
	     * A sort comparison function for a palette item match score.
	     *
	     * #### Notes
	     * This orders the items first based on score (lower is better), then
	     * by locale order of the item category followed by the item text.
	     */
	    function scoreCmp(a, b) {
	        var d1 = a.score - b.score;
	        if (d1 !== 0) {
	            return d1;
	        }
	        var d2 = a.item.category.localeCompare(b.item.category);
	        if (d2 !== 0) {
	            return d2;
	        }
	        return a.item.text.localeCompare(b.item.text);
	    }
	    Private.scoreCmp = scoreCmp;
	    /**
	     * Group item scores by item category.
	     *
	     * @param scores - The items to group by category.
	     *
	     * @returns A mapping of category name to group of items.
	     *
	     * #### Notes
	     * The categories are added to the map in the order of first
	     * appearance in the `scores` array.
	     */
	    function groupScores(scores) {
	        var result = Object.create(null);
	        for (var _i = 0; _i < scores.length; _i++) {
	            var score = scores[_i];
	            var cat = score.item.category;
	            (result[cat] || (result[cat] = [])).push(score);
	        }
	        return result;
	    }
	    Private.groupScores = groupScores;
	    /**
	     * Create the search results for a collection of item scores.
	     *
	     * @param groups - The item scores, grouped by category.
	     *
	     * @param categories - A mapping of category scores.
	     *
	     * @returns A flat array of search results for the groups.
	     *
	     * #### Notes
	     * This function renders the groups in iteration order, which on all
	     * major browsers is order of insertion (a de facto standard).
	     */
	    function createSearchResults(groups, categories) {
	        var results = [];
	        for (var cat in groups) {
	            results.push(createHeaderResult(cat, categories[cat]));
	            for (var _i = 0, _a = groups[cat]; _i < _a.length; _i++) {
	                var score = _a[_i];
	                results.push(createCommandResult(score));
	            }
	        }
	        return results;
	    }
	    Private.createSearchResults = createSearchResults;
	    /**
	     * Normalize the query text for a palette item.
	     *
	     * @param text - The category or text portion of a palette query.
	     *
	     * @returns The normalized query text.
	     *
	     * #### Notes
	     * The text is normalized by converting to lower case and removing
	     * all whitespace.
	     */
	    function normalizeQueryText(text) {
	        return text.replace(/\s+/g, '').toLowerCase();
	    }
	    /**
	     * Create a header search result for the given data.
	     *
	     * @param category - The category name for the header.
	     *
	     * @param score - The score for the category match.
	     *
	     * @returns A header search result for the given data.
	     */
	    function createHeaderResult(category, score) {
	        var text = highlightText(category, score.indices);
	        return { type: abstractmodel_1.SearchResultType.Header, value: { text: text, category: category } };
	    }
	    /**
	     * Create a command search result for the given data.
	     *
	     * @param score - The score for the item match.
	     *
	     * @returns A command search result for the given data.
	     */
	    function createCommandResult(score) {
	        var text = highlightText(score.item.text, score.indices);
	        var _a = score.item, icon = _a.icon, caption = _a.caption, shortcut = _a.shortcut, className = _a.className, handler = _a.handler, args = _a.args;
	        var value = { text: text, icon: icon, caption: caption, shortcut: shortcut, className: className, handler: handler, args: args };
	        return { type: abstractmodel_1.SearchResultType.Command, value: value };
	    }
	    /**
	     * Highlight the matching character of the given text.
	     *
	     * @param text - The text to highlight.
	     *
	     * @param indices - The character indices to highlight, or `null`.
	     *
	     * @returns The text interpolated with `<mark>` tags as needed.
	     */
	    function highlightText(text, indices) {
	        return indices ? stringsearch_1.StringSearch.highlight(text, indices) : text;
	    }
	})(Private || (Private = {}));


/***/ },
/* 58 */
/***/ function(module, exports) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	/**
	 * A namespace which holds string searching functionality.
	 */
	var StringSearch;
	(function (StringSearch) {
	    /**
	     * Compute the sum-of-squares match for the given search text.
	     *
	     * @param sourceText - The text which should be searched.
	     *
	     * @param queryText - The query text to locate in the source text.
	     *
	     * @returns The match result object, or `null` if there is no match.
	     *
	     * #### Notes
	     * This scoring algorithm uses a sum-of-squares approach to determine
	     * the score. In order for there to be a match, all of the characters
	     * in `queryText` **must** appear in `sourceText` in order. The index
	     * of each matching character is squared and added to the score. This
	     * means that early and consecutive character matches are preferred.
	     *
	     * The character match is performed with strict equality. It is case
	     * sensitive and does not ignore whitespace. If those behaviors are
	     * required, the text should be transformed before scoring.
	     *
	     * This has a runtime complexity of `O(n)` on `sourceText`.
	     */
	    function sumOfSquares(sourceText, queryText) {
	        var score = 0;
	        var indices = new Array(queryText.length);
	        for (var i = 0, j = 0, n = queryText.length; i < n; ++i, ++j) {
	            j = sourceText.indexOf(queryText[i], j);
	            if (j === -1)
	                return null;
	            indices[i] = j;
	            score += j * j;
	        }
	        return { score: score, indices: indices };
	    }
	    StringSearch.sumOfSquares = sumOfSquares;
	    /**
	     * Highlight the matched characters of a source string.
	     *
	     * @param source - The text which should be highlighted.
	     *
	     * @param indices - The indices of the matched characters. They must
	     *   appear in increasing order and must be in bounds of the source.
	     *
	     * @returns A string with interpolated `<mark>` tags.
	     */
	    function highlight(sourceText, indices) {
	        var k = 0;
	        var last = 0;
	        var result = '';
	        var n = indices.length;
	        while (k < n) {
	            var i = indices[k];
	            var j = indices[k];
	            while (++k < n && indices[k] === j + 1)
	                j++;
	            var head = sourceText.slice(last, i);
	            var chunk = sourceText.slice(i, j + 1);
	            result += head + "<mark>" + chunk + "</mark>";
	            last = j + 1;
	        }
	        return result + sourceText.slice(last);
	    }
	    StringSearch.highlight = highlight;
	})(StringSearch = exports.StringSearch || (exports.StringSearch = {}));


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(60);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./index.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./index.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, "/*-----------------------------------------------------------------------------\r\n| Copyright (c) 2014-2016, PhosphorJS Contributors\r\n|\r\n| Distributed under the terms of the BSD 3-Clause License.\r\n|\r\n| The full license is in the file LICENSE, distributed with this software.\r\n|----------------------------------------------------------------------------*/\r\n.p-CommandPalette {\r\n  display: flex;\r\n  flex-direction: column;\r\n}\r\n\r\n\r\n.p-CommandPalette-search {\r\n  flex: 0 0 auto;\r\n}\r\n\r\n\r\n.p-CommandPalette-content {\r\n  flex: 1 1 auto;\r\n  margin: 0;\r\n  padding: 0;\r\n  min-height: 0;\r\n  overflow: auto;\r\n  list-style-type: none;\r\n}\r\n\r\n\r\n.p-CommandPalette-header {\r\n  overflow: hidden;\r\n  white-space: nowrap;\r\n  text-overflow: ellipsis;\r\n}\r\n\r\n\r\n.p-CommandPalette-command {\r\n  display: flex;\r\n  flex-direction: row;\r\n}\r\n\r\n\r\n.p-CommandPalette-commandIcon {\r\n  flex: 0 0 auto;\r\n}\r\n\r\n\r\n.p-CommandPalette-commandContent {\r\n  flex: 1 1 auto;\r\n}\r\n\r\n\r\n.p-CommandPalette-commandShortcut {\r\n  float: right;\r\n}\r\n\r\n\r\n.p-CommandPalette-commandText {\r\n  display: block;\r\n  overflow: hidden;\r\n  white-space: nowrap;\r\n  text-overflow: ellipsis;\r\n}\r\n\r\n\r\n.p-CommandPalette-commandCaption {\r\n  display: block;\r\n}\r\n", ""]);

	// exports


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	var phosphor_disposable_1 = __webpack_require__(8);
	var phosphor_keymap_1 = __webpack_require__(62);
	var phosphor_signaling_1 = __webpack_require__(22);
	var commandregistry_1 = __webpack_require__(52);
	/**
	 * An abstract base class which defines a shortcut registry.
	 *
	 * TODO - allow multiple shortcuts for a single command?
	 */
	var ABCShortcutRegistry = (function () {
	    function ABCShortcutRegistry() {
	    }
	    Object.defineProperty(ABCShortcutRegistry.prototype, "shortcutsAdded", {
	        /**
	         * A signal emitted when shortcuts are added to the manager.
	         */
	        get: function () {
	            return Private.shortcutsAddedSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ABCShortcutRegistry.prototype, "shortcutsRemoved", {
	        /**
	         * A signal emitted when shortcuts are removed from the manager.
	         */
	        get: function () {
	            return Private.shortcutsRemovedSignal.bind(this);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return ABCShortcutRegistry;
	}());
	exports.ABCShortcutRegistry = ABCShortcutRegistry;
	/**
	 * A concrete implementation of ABCShortcutRegistry.
	 *
	 * TODO - Support configurable keyboard layout.
	 */
	var ShortcutRegistry = (function (_super) {
	    __extends(ShortcutRegistry, _super);
	    /**
	     * Construct a shortcut manager.
	     *
	     * @param commands - The command registry for executing commands.
	     */
	    function ShortcutRegistry(commands) {
	        var _this = this;
	        _super.call(this);
	        /**
	         * The private key binding handler function.
	         */
	        this._executeCommand = function (id) {
	            _this._commands.execute(id);
	            return true;
	        };
	        this._keymap = new phosphor_keymap_1.KeymapManager();
	        this._commands = null;
	        this._sequences = Private.createSequenceMap();
	        this._commands = commands;
	    }
	    /**
	     * List the currently registered command ids.
	     *
	     * @returns A new array of the registered command ids.
	     */
	    ShortcutRegistry.prototype.list = function () {
	        return Object.keys(this._sequences);
	    };
	    /**
	     * Test whether the registry contains a sequence for a command.
	     *
	     * @param id - The id of the command of interest.
	     *
	     * @returns `true` if a sequence is registered, `false` otherwise.
	     */
	    ShortcutRegistry.prototype.has = function (command) {
	        return command in this._sequences;
	    };
	    /**
	     * Get the key sequence for the given command id.
	     *
	     * @param command - The id of the command of interest.
	     *
	     * @returns The key sequence for the specified command, or null.
	     */
	    ShortcutRegistry.prototype.sequenceFor = function (command) {
	        var sequence = this._sequences[command];
	        return sequence ? sequence.slice() : null;
	    };
	    /**
	     * Add key bindings to the shortcut manager.
	     *
	     * @param bindings - The key bindings to add to the manager.
	     *
	     * @returns A disposable which removes the added key bindings.
	     *
	     * #### Notes
	     * If a shortcut for a specific command is already registered,
	     * a warning will be logged and that specific shortcut will be
	     * ignored.
	     */
	    ShortcutRegistry.prototype.add = function (items) {
	        var _this = this;
	        // Setup the added ids and keybinding arrays.
	        var added = [];
	        var bindings = [];
	        // Convert the shortcut items into key bindings.
	        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
	            var _a = items_1[_i], sequence = _a.sequence, selector = _a.selector, command = _a.command;
	            // Log a warning if the command already has a shortcut.
	            if (command in this._sequences) {
	                console.warn("shortcut already registered for '" + command + "'");
	                continue;
	            }
	            // Register a safe shallow copy of the sequence.
	            sequence = sequence.slice();
	            this._sequences[command] = sequence;
	            // Add the command to the tracking array.
	            added.push(command);
	            // Add a keybinding to the tracking array.
	            var handler = this._executeCommand;
	            bindings.push({ sequence: sequence, selector: selector, handler: handler, args: command });
	        }
	        // If no items are added, return an empty delegate.
	        if (added.length === 0) {
	            return new phosphor_disposable_1.DisposableDelegate(null);
	        }
	        // Add the keybindings to the keymap manager.
	        // TODO - if any keybinding is invalid, we'll be out-of-sync.
	        var addedResult = this._keymap.add(bindings);
	        // Notify for the added shortcuts using a safe shallow copy.
	        this.shortcutsAdded.emit(added.slice());
	        // Return a delegate which will remove the added shortcuts.
	        return new phosphor_disposable_1.DisposableDelegate(function () {
	            addedResult.dispose();
	            for (var _i = 0, added_1 = added; _i < added_1.length; _i++) {
	                var id = added_1[_i];
	                delete _this._sequences[id];
	            }
	            _this.shortcutsRemoved.emit(added.slice());
	        });
	    };
	    /**
	     * Process a `'keydown'` event dispatching a matching shortcut.
	     *
	     * @param event - The event object for the `'keydown'` event.
	     *
	     * #### Notes
	     * This will typically be called automatically by the application.
	     */
	    ShortcutRegistry.prototype.processKeydownEvent = function (event) {
	        this._keymap.processKeydownEvent(event);
	    };
	    return ShortcutRegistry;
	}(ABCShortcutRegistry));
	exports.ShortcutRegistry = ShortcutRegistry;
	/**
	 * The default shortcut registry service provider.
	 */
	exports.shortcutRegistryProvider = {
	    id: 'phosphide.services.shortcutRegistry',
	    provides: ABCShortcutRegistry,
	    requires: [commandregistry_1.ABCCommandRegistry],
	    resolve: function (commands) { return new ShortcutRegistry(commands); },
	};
	/**
	 * The namespace for the private shortcut registry functionality.
	 */
	var Private;
	(function (Private) {
	    /**
	     *
	     */
	    Private.shortcutsAddedSignal = new phosphor_signaling_1.Signal();
	    /**
	     *
	     */
	    Private.shortcutsRemovedSignal = new phosphor_signaling_1.Signal();
	    /**
	     *
	     */
	    function createSequenceMap() {
	        return Object.create(null);
	    }
	    Private.createSequenceMap = createSequenceMap;
	})(Private || (Private = {}));


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(63));
	__export(__webpack_require__(64));


/***/ },
/* 63 */
/***/ function(module, exports) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	/**
	 * Create a normalized keystroke for a `'keydown'` event.
	 *
	 * @param event - The event object for a `'keydown'` event.
	 *
	 * @param layout - The keyboard layout for computing the keycap.
	 *
	 * @returns A normalized keystroke, or an empty string if the event
	 *   does not represent a valid shortcut keystroke.
	 */
	function keystrokeForKeydownEvent(event, layout) {
	    var keycap = layout.keycapForKeydownEvent(event);
	    if (!keycap) {
	        return '';
	    }
	    var mods = '';
	    if (event.metaKey && IS_MAC) {
	        mods += 'Cmd ';
	    }
	    if (event.ctrlKey) {
	        mods += 'Ctrl ';
	    }
	    if (event.altKey) {
	        mods += 'Alt ';
	    }
	    if (event.shiftKey) {
	        mods += 'Shift ';
	    }
	    return mods + keycap;
	}
	exports.keystrokeForKeydownEvent = keystrokeForKeydownEvent;
	/**
	 * Normalize and validate a keystroke.
	 *
	 * @param keystroke - The keystroke to normalize.
	 *
	 * @param layout - The keyboard layout for validating the keycap.
	 *
	 * @returns The normalized keystroke.
	 *
	 * @throws An error if the keystroke is invalid.
	 *
	 * #### Notes
	 * The keystroke must adhere to the format:
	 *
	 *   `[<modifier 1> [<modifier 2> [<modifier N]]] <primary key>`
	 *
	 * The supported modifiers are: `Accel`, `Alt`, `Cmd`, `Ctrl`, and
	 * `Shift`. The `Accel` modifier is translated to `Cmd` on Mac and
	 * `Ctrl` on all other platforms.
	 *
	 * The keystroke must conform to the following:
	 *   - Modifiers and the primary key are case senstive.
	 *   - The primary key must be a valid key for the layout.
	 *   - Whitespace is used to separate modifiers and primary key.
	 *   - Modifiers may appear in any order before the primary key.
	 *   - Modifiers cannot appear in duplicate.
	 *   - The `Cmd` modifier is only valid on Mac.
	 *
	 * If a keystroke is nonconforming, an error will be thrown.
	 */
	function normalizeKeystroke(keystroke, layout) {
	    var keycap = '';
	    var alt = false;
	    var cmd = false;
	    var ctrl = false;
	    var shift = false;
	    for (var _i = 0, _a = keystroke.trim().split(/\s+/); _i < _a.length; _i++) {
	        var token = _a[_i];
	        if (token === 'Accel') {
	            token = IS_MAC ? 'Cmd' : 'Ctrl';
	        }
	        if (token === 'Alt') {
	            if (alt) {
	                throwKeystrokeError(keystroke, '`Alt` appears in duplicate');
	            }
	            if (keycap) {
	                throwKeystrokeError(keystroke, '`Alt` follows primary key');
	            }
	            alt = true;
	        }
	        else if (token === 'Cmd') {
	            if (cmd) {
	                throwKeystrokeError(keystroke, '`Cmd` appears in duplicate');
	            }
	            if (keycap) {
	                throwKeystrokeError(keystroke, '`Cmd` follows primary key');
	            }
	            if (!IS_MAC) {
	                throwKeystrokeError(keystroke, '`Cmd` used on non-Mac platform');
	            }
	            cmd = true;
	        }
	        else if (token === 'Ctrl') {
	            if (ctrl) {
	                throwKeystrokeError(keystroke, '`Ctrl` appears in duplicate');
	            }
	            if (keycap) {
	                throwKeystrokeError(keystroke, '`Ctrl` follows primary key');
	            }
	            ctrl = true;
	        }
	        else if (token === 'Shift') {
	            if (shift) {
	                throwKeystrokeError(keystroke, '`Shift` appears in duplicate');
	            }
	            if (keycap) {
	                throwKeystrokeError(keystroke, '`Shift` follows primary key');
	            }
	            shift = true;
	        }
	        else {
	            if (keycap) {
	                throwKeystrokeError(keystroke, 'primary key appears in duplicate');
	            }
	            if (!layout.isValidKeycap(token)) {
	                throwKeystrokeError(keystroke, 'primary key invalid for layout');
	            }
	            keycap = token;
	        }
	    }
	    if (!keycap) {
	        throwKeystrokeError(keystroke, 'primary key not specified');
	    }
	    var mods = '';
	    if (cmd) {
	        mods += 'Cmd ';
	    }
	    if (ctrl) {
	        mods += 'Ctrl ';
	    }
	    if (alt) {
	        mods += 'Alt ';
	    }
	    if (shift) {
	        mods += 'Shift ';
	    }
	    return mods + keycap;
	}
	exports.normalizeKeystroke = normalizeKeystroke;
	/**
	 * A concrete implementation of [[IKeyboardLayout]] based on keycodes.
	 *
	 * The `.keyCode` property of a `'keydown'` event is a browser and OS
	 * specific representation of the physical key (not character) which
	 * was pressed on a keyboard. While not the most convenient API, it
	 * is currently the only one which works reliably on all browsers.
	 *
	 * This class accepts a user-defined mapping of keycodes to keycaps
	 * (the letter(s) printed on a physical keyboard key) which allows
	 * for reliable keyboard shortcuts tailored to the user's system.
	 */
	var KeycodeLayout = (function () {
	    /**
	     * Construct a new keycode layout.
	     *
	     * @param name - The human readable name for the layout.
	     *
	     * @param codes - A mapping of keycode to keycap value.
	     */
	    function KeycodeLayout(name, codes) {
	        this._name = name;
	        this._codes = codes;
	        this._keys = extractKeys(codes);
	    }
	    Object.defineProperty(KeycodeLayout.prototype, "name", {
	        /**
	         * The human readable read-only name of the layout.
	         */
	        get: function () {
	            return this._name;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Get an array of all keycap values supported by the layout.
	     *
	     * @returns A new array of the supported keycap values.
	     */
	    KeycodeLayout.prototype.keycaps = function () {
	        return Object.keys(this._keys);
	    };
	    /**
	     * Test whether the given keycap is a valid value for the layout.
	     *
	     * @param keycap - The user provided keycap to test for validity.
	     *
	     * @returns `true` if the keycap is valid, `false` otherwise.
	     */
	    KeycodeLayout.prototype.isValidKeycap = function (keycap) {
	        return keycap in this._keys;
	    };
	    /**
	     * Get the keycap for a `'keydown'` event.
	     *
	     * @param event - The event object for a `'keydown'` event.
	     *
	     * @returns The associated keycap value, or an empty string if
	     *   the event does not represent a valid primary shortcut key.
	     */
	    KeycodeLayout.prototype.keycapForKeydownEvent = function (event) {
	        return this._codes[event.keyCode] || '';
	    };
	    return KeycodeLayout;
	})();
	exports.KeycodeLayout = KeycodeLayout;
	/**
	 * A keycode-based keyboard layout for US English keyboards.
	 *
	 * This layout is valid for the following OS/Browser combinations.
	 *
	 * - Windows
	 *   - Chrome
	 *   - Firefox
	 *   - IE
	 *
	 * - OSX
	 *   - Chrome
	 *   - Firefox
	 *   - Safari
	 *
	 * - Linux
	 *   - Chrome
	 *   - Firefox
	 *
	 * Other combinations may also work, but are untested.
	 */
	exports.EN_US = new KeycodeLayout('en-us', {
	    8: 'Backspace',
	    9: 'Tab',
	    13: 'Enter',
	    19: 'Pause',
	    27: 'Escape',
	    32: 'Space',
	    33: 'PageUp',
	    34: 'PageDown',
	    35: 'End',
	    36: 'Home',
	    37: 'ArrowLeft',
	    38: 'ArrowUp',
	    39: 'ArrowRight',
	    40: 'ArrowDown',
	    45: 'Insert',
	    46: 'Delete',
	    48: '0',
	    49: '1',
	    50: '2',
	    51: '3',
	    52: '4',
	    53: '5',
	    54: '6',
	    55: '7',
	    56: '8',
	    57: '9',
	    59: ';',
	    61: '=',
	    65: 'A',
	    66: 'B',
	    67: 'C',
	    68: 'D',
	    69: 'E',
	    70: 'F',
	    71: 'G',
	    72: 'H',
	    73: 'I',
	    74: 'J',
	    75: 'K',
	    76: 'L',
	    77: 'M',
	    78: 'N',
	    79: 'O',
	    80: 'P',
	    81: 'Q',
	    82: 'R',
	    83: 'S',
	    84: 'T',
	    85: 'U',
	    86: 'V',
	    87: 'W',
	    88: 'X',
	    89: 'Y',
	    90: 'Z',
	    93: 'ContextMenu',
	    96: '0',
	    97: '1',
	    98: '2',
	    99: '3',
	    100: '4',
	    101: '5',
	    102: '6',
	    103: '7',
	    104: '8',
	    105: '9',
	    106: '*',
	    107: '+',
	    109: '-',
	    110: '.',
	    111: '/',
	    112: 'F1',
	    113: 'F2',
	    114: 'F3',
	    115: 'F4',
	    116: 'F5',
	    117: 'F6',
	    118: 'F7',
	    119: 'F8',
	    120: 'F9',
	    121: 'F10',
	    122: 'F11',
	    123: 'F12',
	    173: '-',
	    186: ';',
	    187: '=',
	    188: ',',
	    189: '-',
	    190: '.',
	    191: '/',
	    192: '`',
	    219: '[',
	    220: '\\',
	    221: ']',
	    222: '\'',
	});
	/**
	 * A flag indicating whether the platform is Mac.
	 */
	var IS_MAC = !!navigator.platform.match(/Mac/i);
	/**
	 * Throw an error with the give invalid keystroke.
	 */
	function throwKeystrokeError(keystroke, message) {
	    throw new Error("invalid keystroke: " + keystroke + " (" + message + ")");
	}
	/**
	 * Extract the key set from a code map.
	 */
	function extractKeys(codes) {
	    var keys = Object.create(null);
	    for (var c in codes) {
	        keys[codes[c]] = true;
	    }
	    return keys;
	}


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2015, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var clear_cut_1 = __webpack_require__(65);
	var phosphor_disposable_1 = __webpack_require__(8);
	var keyboard_1 = __webpack_require__(63);
	/**
	 * A class which manages a collection of key bindings.
	 */
	var KeymapManager = (function () {
	    /**
	     * Construct a new key map manager.
	     *
	     * @param layout - The keyboard layout to use with the manager.
	     *   The default layout is US English.
	     */
	    function KeymapManager(layout) {
	        if (layout === void 0) { layout = keyboard_1.EN_US; }
	        this._timer = 0;
	        this._replaying = false;
	        this._sequence = [];
	        this._exact = null;
	        this._bindings = [];
	        this._events = [];
	        this._layout = layout;
	    }
	    Object.defineProperty(KeymapManager.prototype, "layout", {
	        /**
	         * Get the keyboard layout used by the manager.
	         *
	         * #### Notes
	         * This is a read-only property.
	         */
	        get: function () {
	            return this._layout;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Add key bindings to the key map manager.
	     *
	     * @param bindings - The key bindings to add to the manager.
	     *
	     * @returns A disposable which removes the added key bindings.
	     *
	     * #### Notes
	     * If a key binding is invalid, a warning will be logged to the
	     * console and the offending key binding will be ignored.
	     *
	     * If multiple key bindings are registered for the same sequence,
	     * the binding with the highest CSS specificity is executed first.
	     *
	     * Ambiguous key bindings are resolved with a timeout.
	     */
	    KeymapManager.prototype.add = function (bindings) {
	        var _this = this;
	        var exbArray = [];
	        for (var _i = 0; _i < bindings.length; _i++) {
	            var kb = bindings[_i];
	            var exb = createExBinding(kb, this._layout);
	            if (exb !== null)
	                exbArray.push(exb);
	        }
	        Array.prototype.push.apply(this._bindings, exbArray);
	        return new phosphor_disposable_1.DisposableDelegate(function () { return _this._removeBindings(exbArray); });
	    };
	    /**
	     * Process a `'keydown'` event and invoke a matching key binding.
	     *
	     * @param event - The event object for a `'keydown'` event.
	     *
	     * #### Notes
	     * This should be called in response to a `'keydown'` event in order
	     * to invoke the handler function of the best matching key binding.
	     *
	     * The manager **does not** install its own key event listeners. This
	     * allows user code full control over the nodes for which the manager
	     * processes `'keydown'` events.
	     */
	    KeymapManager.prototype.processKeydownEvent = function (event) {
	        // Bail immediately if playing back keystrokes.
	        if (this._replaying) {
	            return;
	        }
	        // Get the canonical keystroke for the event. An empty string
	        // indicates a keystroke which cannot be a valid key shortcut.
	        var keystroke = keyboard_1.keystrokeForKeydownEvent(event, this._layout);
	        if (!keystroke) {
	            return;
	        }
	        // Add the keystroke to the current key sequence.
	        this._sequence.push(keystroke);
	        // Find the exact and partial matches for the key sequence.
	        var _a = findMatch(this._bindings, this._sequence, event), exact = _a.exact, partial = _a.partial;
	        // If there is no exact or partial match, replay any suppressed
	        // events and clear the pending state so that the next key press
	        // starts from a fresh default state.
	        if (!exact && !partial) {
	            this._replayEvents();
	            this._clearPendingState();
	            return;
	        }
	        // Stop propagation of the event. If there is only a partial match,
	        // the event will be replayed if a final match is never triggered.
	        event.preventDefault();
	        event.stopPropagation();
	        // If there is an exact match but no partial, the exact match can
	        // be dispatched immediately. The pending state is cleared so the
	        // next key press starts from a fresh default state.
	        if (!partial) {
	            safeInvoke(exact);
	            this._clearPendingState();
	            return;
	        }
	        // If there is both an exact match and a partial, the exact match
	        // is stored for future dispatch in case the timer expires before
	        // a more specific match is triggered.
	        if (exact)
	            this._exact = exact;
	        // Store the event for possible playback in the future.
	        this._events.push(event);
	        // (Re)start the timer to dispatch the most recent exact match
	        // in case the partial match fails to result in an exact match.
	        this._startTimer();
	    };
	    /**
	     * Remove an array of extended bindings from the key map.
	     */
	    KeymapManager.prototype._removeBindings = function (exbArray) {
	        var count = 0;
	        for (var i = 0, n = this._bindings.length; i < n; ++i) {
	            var exb = this._bindings[i];
	            if (exbArray.indexOf(exb) !== -1) {
	                count++;
	            }
	            else {
	                this._bindings[i - count] = exb;
	            }
	        }
	        this._bindings.length -= count;
	    };
	    /**
	     * Start or restart the pending timer for the key map.
	     */
	    KeymapManager.prototype._startTimer = function () {
	        var _this = this;
	        this._clearTimer();
	        this._timer = setTimeout(function () {
	            _this._onPendingTimeout();
	        }, 1000);
	    };
	    /**
	     * Clear the pending timer for the key map.
	     */
	    KeymapManager.prototype._clearTimer = function () {
	        if (this._timer !== 0) {
	            clearTimeout(this._timer);
	            this._timer = 0;
	        }
	    };
	    /**
	     * Replay the events which were suppressed.
	     */
	    KeymapManager.prototype._replayEvents = function () {
	        if (this._events.length === 0) {
	            return;
	        }
	        this._replaying = true;
	        for (var _i = 0, _a = this._events; _i < _a.length; _i++) {
	            var evt = _a[_i];
	            var clone = cloneKeyboardEvent(evt);
	            evt.target.dispatchEvent(clone);
	        }
	        this._replaying = false;
	    };
	    /**
	     * Clear the pending state for the keymap.
	     */
	    KeymapManager.prototype._clearPendingState = function () {
	        this._clearTimer();
	        this._exact = null;
	        this._events.length = 0;
	        this._sequence.length = 0;
	    };
	    /**
	     * Handle the partial match timeout.
	     */
	    KeymapManager.prototype._onPendingTimeout = function () {
	        this._timer = 0;
	        if (this._exact) {
	            safeInvoke(this._exact);
	        }
	        else {
	            this._replayEvents();
	        }
	        this._clearPendingState();
	    };
	    return KeymapManager;
	})();
	exports.KeymapManager = KeymapManager;
	/**
	 * Create an extended key binding from a user key binding.
	 *
	 * Warns and returns `null` if the key binding is invalid.
	 */
	function createExBinding(binding, layout) {
	    if (!clear_cut_1.isSelectorValid(binding.selector)) {
	        console.warn("invalid key binding selector: " + binding.selector);
	        return null;
	    }
	    if (binding.sequence.length === 0) {
	        console.warn('empty key sequence for key binding');
	        return null;
	    }
	    try {
	        var sequence = binding.sequence.map(function (ks) { return keyboard_1.normalizeKeystroke(ks, layout); });
	    }
	    catch (e) {
	        console.warn(e.message);
	        return null;
	    }
	    return {
	        sequence: sequence,
	        args: binding.args,
	        handler: binding.handler,
	        selector: binding.selector,
	        specificity: clear_cut_1.calculateSpecificity(binding.selector),
	    };
	}
	;
	/**
	 * Test whether a binding sequence matches a key sequence.
	 *
	 * Returns a `SequenceMatch` value indicating the type of match.
	 */
	function matchSequence(exbSeq, keySeq) {
	    if (exbSeq.length < keySeq.length) {
	        return 0 /* None */;
	    }
	    for (var i = 0, n = keySeq.length; i < n; ++i) {
	        if (exbSeq[i] !== keySeq[i]) {
	            return 0 /* None */;
	        }
	    }
	    if (exbSeq.length > keySeq.length) {
	        return 2 /* Partial */;
	    }
	    return 1 /* Exact */;
	}
	/**
	 * Find the distance from the target node to the first matching node.
	 *
	 * This traverses the event path from `target` to `currentTarget` and
	 * computes the distance from `target` to the first node which matches
	 * the CSS selector. If no match is found, `-1` is returned.
	 */
	function targetDistance(selector, event) {
	    var distance = 0;
	    var target = event.target;
	    var current = event.currentTarget;
	    for (; target !== null; target = target.parentElement, ++distance) {
	        if (matchesSelector(target, selector)) {
	            return distance;
	        }
	        if (target === current) {
	            return -1;
	        }
	    }
	    return -1;
	}
	/**
	 * Find the bindings which match a key sequence.
	 *
	 * This returns a match result which contains the best exact matching
	 * binding, and a flag which indicates if there are partial matches.
	 */
	function findMatch(bindings, sequence, event) {
	    // Whether a partial match has been found.
	    var partial = false;
	    // The current best exact match.
	    var exact = null;
	    // The match distance for the exact match.
	    var distance = Infinity;
	    // Iterate the bindings and search for the best match.
	    for (var i = 0, n = bindings.length; i < n; ++i) {
	        // Lookup the current binding.
	        var exb = bindings[i];
	        // Check whether the binding sequence is a match.
	        var match = matchSequence(exb.sequence, sequence);
	        // If there is no match, the binding is ignored.
	        if (match === 0 /* None */) {
	            continue;
	        }
	        // If it is a partial match and no other partial match has been
	        // found, ensure the selector matches and mark the partial flag.
	        if (match === 2 /* Partial */) {
	            if (!partial && targetDistance(exb.selector, event) !== -1) {
	                partial = true;
	            }
	            continue;
	        }
	        // Otherwise, it's an exact match. Update the best match if the
	        // binding is a stronger match than the current best exact match.
	        var td = targetDistance(exb.selector, event);
	        if (td !== -1 && td <= distance) {
	            if (exact === null || exb.specificity > exact.specificity) {
	                exact = exb;
	                distance = td;
	            }
	        }
	    }
	    // Return the match result.
	    return { exact: exact, partial: partial };
	}
	/**
	 * Safely invoke the handler for the key binding.
	 *
	 * Exceptions in the handler will be caught and logged.
	 */
	function safeInvoke(binding) {
	    try {
	        binding.handler.call(void 0, binding.args);
	    }
	    catch (err) {
	        console.error(err);
	    }
	}
	/**
	 * A cross-browser CSS selector matching prototype function.
	 *
	 * This function must be called with an element as `this` context.
	 */
	var protoMatchFunc = (function () {
	    var proto = Element.prototype;
	    return (proto.matches ||
	        proto.matchesSelector ||
	        proto.mozMatchesSelector ||
	        proto.msMatchesSelector ||
	        proto.oMatchesSelector ||
	        proto.webkitMatchesSelector ||
	        (function (selector) {
	            var elem = this;
	            var matches = elem.ownerDocument.querySelectorAll(selector);
	            return Array.prototype.indexOf.call(matches, elem) !== -1;
	        }));
	})();
	/**
	 * Test whether an element matches a CSS selector.
	 */
	function matchesSelector(elem, selector) {
	    return protoMatchFunc.call(elem, selector);
	}
	/**
	 * Clone a keyboard event.
	 *
	 * #### Notes
	 * A custom event is required because Chrome nulls out the `keyCode`
	 * field in user-generated `KeyboardEvent` types.
	 */
	function cloneKeyboardEvent(event) {
	    var clone = document.createEvent('Event');
	    var bubbles = event.bubbles || true;
	    var cancelable = event.cancelable || true;
	    clone.initEvent(event.type || 'keydown', bubbles, cancelable);
	    clone.key = event.key || '';
	    clone.keyCode = event.keyCode || 0;
	    clone.which = event.keyCode || 0;
	    clone.ctrlKey = event.ctrlKey || false;
	    clone.altKey = event.altKey || false;
	    clone.shiftKey = event.shiftKey || false;
	    clone.metaKey = event.metaKey || false;
	    clone.view = event.view || window;
	    return clone;
	}


/***/ },
/* 65 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Originally ported from https://github.com/keeganstreet/specificity/blob/866bf7ab4e7f62a7179c15b13a95af4e1c7b1afa/specificity.js
	 *
	 * Calculates the specificity of CSS selectors
	 * http://www.w3.org/TR/css3-selectors/#specificity
	 *
	 * Returns a selector integer value
	 */

	// The following regular expressions assume that selectors matching the preceding regular expressions have been removed
	var attributeRegex = /(\[[^\]]+\])/g;
	var idRegex = /(#[^\s\+>~\.\[:]+)/g;
	var classRegex = /(\.[^\s\+>~\.\[:]+)/g;
	var pseudoElementRegex = /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/g;
	var pseudoClassRegex = /(:[^\s\+>~\.\[:]+)/g;
	var elementRegex = /([^\s\+>~\.\[:]+)/g;
	var notRegex = /:not\(([^\)]*)\)/g;
	var ruleRegex = /\{[^]*/gm;
	var separatorRegex = /[\*\s\+>~]/g;
	var straysRegex = /[#\.]/g;

	// Find matches for a regular expression in a string and push their details to parts
	// Type is "a" for IDs, "b" for classes, attributes and pseudo-classes and "c" for elements and pseudo-elements
	var findMatch = function(regex, type, types, selector) {
	  var matches = selector.match(regex);
	  if (matches) {
	    for (var i = 0; i < matches.length; i++) {
	      types[type]++;
	      // Replace this simple selector with whitespace so it won't be counted in further simple selectors
	      selector = selector.replace(matches[i], ' ');
	    }
	  }

	  return selector;
	}

	// Calculate the specificity for a selector by dividing it into simple selectors and counting them
	var calculate = function(selector) {
	  var commaIndex = selector.indexOf(',');
	  if (commaIndex !== -1) {
	    selector = selector.substring(0, commaIndex);
	  }

	  var  types = {
	    a: 0,
	    b: 0,
	    c: 0
	  };

	  // Remove the negation psuedo-class (:not) but leave its argument because specificity is calculated on its argument
	  selector = selector.replace(notRegex, ' $1 ');

	  // Remove anything after a left brace in case a user has pasted in a rule, not just a selector
	  selector = selector.replace(ruleRegex, ' ');

	  // Add attribute selectors to parts collection (type b)
	  selector = findMatch(attributeRegex, 'b', types, selector);

	  // Add ID selectors to parts collection (type a)
	  selector = findMatch(idRegex, 'a', types, selector);

	  // Add class selectors to parts collection (type b)
	  selector = findMatch(classRegex, 'b', types, selector);

	  // Add pseudo-element selectors to parts collection (type c)
	  selector = findMatch(pseudoElementRegex, 'c', types, selector);

	  // Add pseudo-class selectors to parts collection (type b)
	  selector = findMatch(pseudoClassRegex, 'b', types, selector);

	  // Remove universal selector and separator characters
	  selector = selector.replace(separatorRegex, ' ');

	  // Remove any stray dots or hashes which aren't attached to words
	  // These may be present if the user is live-editing this selector
	  selector = selector.replace(straysRegex, ' ');

	  // The only things left should be element selectors (type c)
	  findMatch(elementRegex, 'c', types, selector);

	  return (types.a * 100) + (types.b * 10) + (types.c * 1);
	}

	var specificityCache = {};

	exports.calculateSpecificity = function(selector) {
	  var specificity = specificityCache[selector];
	  if (specificity === undefined) {
	    specificity = calculate(selector);
	    specificityCache[selector] = specificity;
	  }
	  return specificity;
	}

	if (global.document) {
	  var validSelectorCache = {};
	  var testSelectorElement = global.document.createElement('div');

	  exports.isSelectorValid = function(selector) {
	    var valid = validSelectorCache[selector];
	    if (valid === undefined) {
	      try {
	        testSelectorElement.querySelector(selector);
	        valid = true;
	      } catch (error) {
	        valid = false;
	      }
	      validSelectorCache[selector] = valid;
	    }
	    return valid;
	  }

	  exports.validateSelector = function(selector) {
	    if (!exports.isSelectorValid(selector)) {
	      var error = new SyntaxError(selector + ' is not a valid selector');
	      error.code = 'EBADSELECTOR';
	      throw error;
	    }
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	var phosphor_commandpalette_1 = __webpack_require__(54);
	/**
	 * The default commmand palette extension.
	 */
	exports.commandPaletteExtension = {
	    id: 'phosphide.extensions.commandPalette',
	    activate: activateCommandPalette
	};
	/**
	 *
	 */
	function activateCommandPalette(app) {
	    var widget = new phosphor_commandpalette_1.CommandPalette();
	    widget.id = 'command-palette';
	    widget.title.text = 'Commands';
	    widget.model = app.palette.model;
	    app.commands.add([
	        { id: 'command-palette:toggle', handler: togglePalette },
	        { id: 'command-palette:activate', handler: activatePalette },
	        { id: 'command-palette:hide', handler: hidePalette }
	    ]);
	    app.shell.addToLeftArea(widget);
	    return Promise.resolve();
	    function activatePalette() {
	        app.shell.activateLeft(widget.id);
	        widget.inputNode.focus();
	        widget.inputNode.select();
	    }
	    function hidePalette() {
	        if (!widget.isHidden)
	            app.shell.collapseLeft();
	    }
	    function togglePalette() {
	        if (widget.isHidden) {
	            activatePalette();
	        }
	        else {
	            hidePalette();
	        }
	    }
	}


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var phosphor_widget_1 = __webpack_require__(20);
	exports.blueExtension = {
	    id: 'phosphide.example.blue',
	    activate: activateBlue
	};
	function createCommandItem(id, message) {
	    return { id: id, handler: function () { console.log("COMMAND: " + message); } };
	}
	function activateBlue(app) {
	    var widget = new phosphor_widget_1.Widget();
	    widget.id = 'blue';
	    widget.title.text = 'Blue';
	    widget.addClass('blue-content');
	    var commandItems = [
	        createCommandItem('blue:show-0', 'Blue is best!'),
	        createCommandItem('blue:show-1', 'Blue number one'),
	        createCommandItem('blue:show-2', 'Blue number two'),
	        createCommandItem('blue:show-3', 'Blue number three'),
	        createCommandItem('blue:show-4', 'Blue number four'),
	        createCommandItem('blue:show-5', 'Blue number five')
	    ];
	    var paletteItems = [
	        {
	            command: 'blue:show-0',
	            text: 'Blue 0',
	            caption: 'Blue is best!',
	            category: 'All Colours'
	        },
	        {
	            command: 'blue:show-1',
	            text: 'Blue 1',
	            caption: 'Blue number one',
	            category: 'Blue'
	        },
	        {
	            command: 'blue:show-2',
	            text: 'Blue 2',
	            caption: 'Blue number two',
	            category: 'Blue'
	        },
	        {
	            command: 'blue:show-3',
	            text: 'Blue 3',
	            caption: 'Blue number three',
	            category: 'Blue'
	        },
	        {
	            command: 'blue:show-4',
	            text: 'Blue 4',
	            caption: 'Blue number four',
	            category: 'Blue'
	        },
	        {
	            command: 'blue:show-5',
	            text: 'Blue 5',
	            caption: 'Blue number five',
	            category: 'Blue'
	        }
	    ];
	    var shortcutItems = [
	        {
	            sequence: ['Ctrl B'],
	            selector: '*',
	            command: 'blue:show-0'
	        }
	    ];
	    app.commands.add(commandItems);
	    app.shortcuts.add(shortcutItems);
	    app.palette.add(paletteItems);
	    app.shell.addToLeftArea(widget, { rank: 10 });
	    return Promise.resolve();
	}


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var phosphor_widget_1 = __webpack_require__(20);
	exports.greenExtension = {
	    id: 'phosphide.example.green',
	    activate: activateGreen
	};
	function createCommandItem(id, message) {
	    return { id: id, handler: function () { console.log("COMMAND: " + message); } };
	}
	function activateGreen(app) {
	    var widget = new phosphor_widget_1.Widget();
	    widget.id = 'green';
	    widget.title.text = 'Green';
	    widget.addClass('green-content');
	    var commandItems = [
	        createCommandItem('green:show-0', 'Green is best!'),
	        createCommandItem('green:show-1', 'Green number one'),
	        createCommandItem('green:show-2', 'Green number two'),
	        createCommandItem('green:show-3', 'Green number three'),
	        createCommandItem('green:show-4', 'Green number four'),
	        createCommandItem('green:show-5', 'Green number five')
	    ];
	    var paletteItems = [
	        {
	            command: 'green:show-0',
	            text: 'Green 0',
	            caption: 'Green is best!',
	            category: 'All Colours'
	        },
	        {
	            command: 'green:show-1',
	            text: 'Green 1',
	            caption: 'Green number one',
	            category: 'Green'
	        },
	        {
	            command: 'green:show-2',
	            text: 'Green 2',
	            caption: 'Green number two',
	            category: 'Green'
	        },
	        {
	            command: 'green:show-3',
	            text: 'Green 3',
	            caption: 'Green number three',
	            category: 'Green'
	        },
	        {
	            command: 'green:show-4',
	            text: 'Green 4',
	            caption: 'Green number four',
	            category: 'Green'
	        },
	        {
	            command: 'green:show-5',
	            text: 'Green 5',
	            caption: 'Green number five',
	            category: 'Green'
	        }
	    ];
	    var shortcutItems = [
	        {
	            sequence: ['Ctrl G'],
	            selector: '*',
	            command: 'green:show-0'
	        }
	    ];
	    app.commands.add(commandItems);
	    app.shortcuts.add(shortcutItems);
	    app.palette.add(paletteItems);
	    app.shell.addToRightArea(widget, { rank: 40 });
	    return Promise.resolve();
	}


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var phosphor_widget_1 = __webpack_require__(20);
	exports.redExtension = {
	    id: 'phosphide.example.red',
	    activate: activateRed
	};
	function createCommandItem(id, message) {
	    return { id: id, handler: function () { console.log("COMMAND: " + message); } };
	}
	function activateRed(app) {
	    var widget = new phosphor_widget_1.Widget();
	    widget.id = 'red';
	    widget.title.text = 'Red';
	    widget.addClass('red-content');
	    var commandItems = [
	        createCommandItem('red:show-0', 'Red is best!'),
	        createCommandItem('red:show-1', 'Red number one'),
	        createCommandItem('red:show-2', 'Red number two'),
	        createCommandItem('red:show-3', 'Red number three'),
	        createCommandItem('red:show-4', 'Red number four'),
	        createCommandItem('red:show-5', 'Red number five')
	    ];
	    var paletteItems = [
	        {
	            command: 'red:show-0',
	            text: 'Red 0',
	            caption: 'Red is best!',
	            category: 'All Colours'
	        },
	        {
	            command: 'red:show-1',
	            text: 'Red 1',
	            caption: 'Red number one',
	            category: 'Red'
	        },
	        {
	            command: 'red:show-2',
	            text: 'Red 2',
	            caption: 'Red number two',
	            category: 'Red'
	        },
	        {
	            command: 'red:show-3',
	            text: 'Red 3',
	            caption: 'Red number three',
	            category: 'Red'
	        },
	        {
	            command: 'red:show-4',
	            text: 'Red 4',
	            caption: 'Red number four',
	            category: 'Red'
	        },
	        {
	            command: 'red:show-5',
	            text: 'Red 5',
	            caption: 'Red number five',
	            category: 'Red'
	        }
	    ];
	    var shortcutItems = [
	        {
	            sequence: ['Ctrl R'],
	            selector: '*',
	            command: 'red:show-0'
	        }
	    ];
	    app.commands.add(commandItems);
	    app.shortcuts.add(shortcutItems);
	    app.palette.add(paletteItems);
	    app.shell.addToRightArea(widget, { rank: 30 });
	    return Promise.resolve();
	}


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var phosphor_widget_1 = __webpack_require__(20);
	exports.yellowExtension = {
	    id: 'phosphide.example.yellow',
	    activate: activateYellow
	};
	function createCommandItem(id, message) {
	    return { id: id, handler: function () { console.log("COMMAND: " + message); } };
	}
	function activateYellow(app) {
	    var widget = new phosphor_widget_1.Widget();
	    widget.id = 'yellow';
	    widget.title.text = 'Yellow';
	    widget.addClass('yellow-content');
	    var commandItems = [
	        createCommandItem('yellow:show-0', 'Yellow is best!'),
	        createCommandItem('yellow:show-1', 'Yellow number one'),
	        createCommandItem('yellow:show-2', 'Yellow number two'),
	        createCommandItem('yellow:show-3', 'Yellow number three'),
	        createCommandItem('yellow:show-4', 'Yellow number four'),
	        createCommandItem('yellow:show-5', 'Yellow number five')
	    ];
	    var paletteItems = [
	        {
	            command: 'yellow:show-0',
	            text: 'Yellow 0',
	            caption: 'Yellow is best!',
	            category: 'All Colours'
	        },
	        {
	            command: 'yellow:show-1',
	            text: 'Yellow 1',
	            caption: 'Yellow number one',
	            category: 'Yellow'
	        },
	        {
	            command: 'yellow:show-2',
	            text: 'Yellow 2',
	            caption: 'Yellow number two',
	            category: 'Yellow'
	        },
	        {
	            command: 'yellow:show-3',
	            text: 'Yellow 3',
	            caption: 'Yellow number three',
	            category: 'Yellow'
	        },
	        {
	            command: 'yellow:show-4',
	            text: 'Yellow 4',
	            caption: 'Yellow number four',
	            category: 'Yellow'
	        },
	        {
	            command: 'yellow:show-5',
	            text: 'Yellow 5',
	            caption: 'Yellow number five',
	            category: 'Yellow'
	        }
	    ];
	    var shortcutItems = [
	        {
	            sequence: ['Ctrl Y'],
	            selector: '*',
	            command: 'yellow:show-0'
	        }
	    ];
	    app.commands.add(commandItems);
	    app.shortcuts.add(shortcutItems);
	    app.palette.add(paletteItems);
	    app.shell.addToLeftArea(widget, { rank: 20 });
	    return Promise.resolve();
	}


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/*-----------------------------------------------------------------------------
	| Copyright (c) 2014-2016, PhosphorJS Contributors
	|
	| Distributed under the terms of the BSD 3-Clause License.
	|
	| The full license is in the file LICENSE, distributed with this software.
	|----------------------------------------------------------------------------*/
	'use strict';
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var CodeMirror = __webpack_require__(72);
	var phosphor_widget_1 = __webpack_require__(20);
	__webpack_require__(73);
	__webpack_require__(75);
	exports.editorExtension = {
	    id: 'phosphide.example.editor',
	    activate: activateEditor
	};
	function activateEditor(app) {
	    for (var i = 0; i < 5; ++i) {
	        var editor = createEditor(i);
	        app.shell.addToMainArea(editor);
	    }
	    return Promise.resolve();
	}
	function createEditor(n) {
	    var widget = new CodeMirrorWidget({
	        mode: 'text/typescript',
	        lineNumbers: true,
	        tabSize: 2,
	    });
	    widget.id = "editor-" + n;
	    widget.title.text = "Untitled - " + n + ".ts";
	    return widget;
	}
	var CodeMirrorWidget = (function (_super) {
	    __extends(CodeMirrorWidget, _super);
	    function CodeMirrorWidget(config) {
	        _super.call(this);
	        this.addClass('editor-CodeMirrorWidget');
	        this._editor = CodeMirror(this.node, config);
	    }
	    Object.defineProperty(CodeMirrorWidget.prototype, "editor", {
	        get: function () {
	            return this._editor;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    CodeMirrorWidget.prototype.onAfterAttach = function (msg) {
	        this._editor.refresh();
	    };
	    CodeMirrorWidget.prototype.onResize = function (msg) {
	        if (msg.width < 0 || msg.height < 0) {
	            this._editor.refresh();
	        }
	        else {
	            this._editor.setSize(msg.width, msg.height);
	        }
	    };
	    return CodeMirrorWidget;
	}(phosphor_widget_1.Widget));


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE

	// This is CodeMirror (http://codemirror.net), a code editor
	// implemented in JavaScript on top of the browser's DOM.
	//
	// You can find some technical background for some of the code below
	// at http://marijnhaverbeke.nl/blog/#cm-internals .

	(function(mod) {
	  if (true) // CommonJS
	    module.exports = mod();
	  else if (typeof define == "function" && define.amd) // AMD
	    return define([], mod);
	  else // Plain browser env
	    (this || window).CodeMirror = mod();
	})(function() {
	  "use strict";

	  // BROWSER SNIFFING

	  // Kludges for bugs and behavior differences that can't be feature
	  // detected are enabled based on userAgent etc sniffing.
	  var userAgent = navigator.userAgent;
	  var platform = navigator.platform;

	  var gecko = /gecko\/\d/i.test(userAgent);
	  var ie_upto10 = /MSIE \d/.test(userAgent);
	  var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(userAgent);
	  var ie = ie_upto10 || ie_11up;
	  var ie_version = ie && (ie_upto10 ? document.documentMode || 6 : ie_11up[1]);
	  var webkit = /WebKit\//.test(userAgent);
	  var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(userAgent);
	  var chrome = /Chrome\//.test(userAgent);
	  var presto = /Opera\//.test(userAgent);
	  var safari = /Apple Computer/.test(navigator.vendor);
	  var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent);
	  var phantom = /PhantomJS/.test(userAgent);

	  var ios = /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent);
	  // This is woefully incomplete. Suggestions for alternative methods welcome.
	  var mobile = ios || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
	  var mac = ios || /Mac/.test(platform);
	  var chromeOS = /\bCrOS\b/.test(userAgent);
	  var windows = /win/i.test(platform);

	  var presto_version = presto && userAgent.match(/Version\/(\d*\.\d*)/);
	  if (presto_version) presto_version = Number(presto_version[1]);
	  if (presto_version && presto_version >= 15) { presto = false; webkit = true; }
	  // Some browsers use the wrong event properties to signal cmd/ctrl on OS X
	  var flipCtrlCmd = mac && (qtwebkit || presto && (presto_version == null || presto_version < 12.11));
	  var captureRightClick = gecko || (ie && ie_version >= 9);

	  // Optimize some code when these features are not used.
	  var sawReadOnlySpans = false, sawCollapsedSpans = false;

	  // EDITOR CONSTRUCTOR

	  // A CodeMirror instance represents an editor. This is the object
	  // that user code is usually dealing with.

	  function CodeMirror(place, options) {
	    if (!(this instanceof CodeMirror)) return new CodeMirror(place, options);

	    this.options = options = options ? copyObj(options) : {};
	    // Determine effective options based on given values and defaults.
	    copyObj(defaults, options, false);
	    setGuttersForLineNumbers(options);

	    var doc = options.value;
	    if (typeof doc == "string") doc = new Doc(doc, options.mode, null, options.lineSeparator);
	    this.doc = doc;

	    var input = new CodeMirror.inputStyles[options.inputStyle](this);
	    var display = this.display = new Display(place, doc, input);
	    display.wrapper.CodeMirror = this;
	    updateGutters(this);
	    themeChanged(this);
	    if (options.lineWrapping)
	      this.display.wrapper.className += " CodeMirror-wrap";
	    if (options.autofocus && !mobile) display.input.focus();
	    initScrollbars(this);

	    this.state = {
	      keyMaps: [],  // stores maps added by addKeyMap
	      overlays: [], // highlighting overlays, as added by addOverlay
	      modeGen: 0,   // bumped when mode/overlay changes, used to invalidate highlighting info
	      overwrite: false,
	      delayingBlurEvent: false,
	      focused: false,
	      suppressEdits: false, // used to disable editing during key handlers when in readOnly mode
	      pasteIncoming: false, cutIncoming: false, // help recognize paste/cut edits in input.poll
	      selectingText: false,
	      draggingText: false,
	      highlight: new Delayed(), // stores highlight worker timeout
	      keySeq: null,  // Unfinished key sequence
	      specialChars: null
	    };

	    var cm = this;

	    // Override magic textarea content restore that IE sometimes does
	    // on our hidden textarea on reload
	    if (ie && ie_version < 11) setTimeout(function() { cm.display.input.reset(true); }, 20);

	    registerEventHandlers(this);
	    ensureGlobalHandlers();

	    startOperation(this);
	    this.curOp.forceUpdate = true;
	    attachDoc(this, doc);

	    if ((options.autofocus && !mobile) || cm.hasFocus())
	      setTimeout(bind(onFocus, this), 20);
	    else
	      onBlur(this);

	    for (var opt in optionHandlers) if (optionHandlers.hasOwnProperty(opt))
	      optionHandlers[opt](this, options[opt], Init);
	    maybeUpdateLineNumberWidth(this);
	    if (options.finishInit) options.finishInit(this);
	    for (var i = 0; i < initHooks.length; ++i) initHooks[i](this);
	    endOperation(this);
	    // Suppress optimizelegibility in Webkit, since it breaks text
	    // measuring on line wrapping boundaries.
	    if (webkit && options.lineWrapping &&
	        getComputedStyle(display.lineDiv).textRendering == "optimizelegibility")
	      display.lineDiv.style.textRendering = "auto";
	  }

	  // DISPLAY CONSTRUCTOR

	  // The display handles the DOM integration, both for input reading
	  // and content drawing. It holds references to DOM nodes and
	  // display-related state.

	  function Display(place, doc, input) {
	    var d = this;
	    this.input = input;

	    // Covers bottom-right square when both scrollbars are present.
	    d.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler");
	    d.scrollbarFiller.setAttribute("cm-not-content", "true");
	    // Covers bottom of gutter when coverGutterNextToScrollbar is on
	    // and h scrollbar is present.
	    d.gutterFiller = elt("div", null, "CodeMirror-gutter-filler");
	    d.gutterFiller.setAttribute("cm-not-content", "true");
	    // Will contain the actual code, positioned to cover the viewport.
	    d.lineDiv = elt("div", null, "CodeMirror-code");
	    // Elements are added to these to represent selection and cursors.
	    d.selectionDiv = elt("div", null, null, "position: relative; z-index: 1");
	    d.cursorDiv = elt("div", null, "CodeMirror-cursors");
	    // A visibility: hidden element used to find the size of things.
	    d.measure = elt("div", null, "CodeMirror-measure");
	    // When lines outside of the viewport are measured, they are drawn in this.
	    d.lineMeasure = elt("div", null, "CodeMirror-measure");
	    // Wraps everything that needs to exist inside the vertically-padded coordinate system
	    d.lineSpace = elt("div", [d.measure, d.lineMeasure, d.selectionDiv, d.cursorDiv, d.lineDiv],
	                      null, "position: relative; outline: none");
	    // Moved around its parent to cover visible view.
	    d.mover = elt("div", [elt("div", [d.lineSpace], "CodeMirror-lines")], null, "position: relative");
	    // Set to the height of the document, allowing scrolling.
	    d.sizer = elt("div", [d.mover], "CodeMirror-sizer");
	    d.sizerWidth = null;
	    // Behavior of elts with overflow: auto and padding is
	    // inconsistent across browsers. This is used to ensure the
	    // scrollable area is big enough.
	    d.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerGap + "px; width: 1px;");
	    // Will contain the gutters, if any.
	    d.gutters = elt("div", null, "CodeMirror-gutters");
	    d.lineGutter = null;
	    // Actual scrollable element.
	    d.scroller = elt("div", [d.sizer, d.heightForcer, d.gutters], "CodeMirror-scroll");
	    d.scroller.setAttribute("tabIndex", "-1");
	    // The element in which the editor lives.
	    d.wrapper = elt("div", [d.scrollbarFiller, d.gutterFiller, d.scroller], "CodeMirror");

	    // Work around IE7 z-index bug (not perfect, hence IE7 not really being supported)
	    if (ie && ie_version < 8) { d.gutters.style.zIndex = -1; d.scroller.style.paddingRight = 0; }
	    if (!webkit && !(gecko && mobile)) d.scroller.draggable = true;

	    if (place) {
	      if (place.appendChild) place.appendChild(d.wrapper);
	      else place(d.wrapper);
	    }

	    // Current rendered range (may be bigger than the view window).
	    d.viewFrom = d.viewTo = doc.first;
	    d.reportedViewFrom = d.reportedViewTo = doc.first;
	    // Information about the rendered lines.
	    d.view = [];
	    d.renderedView = null;
	    // Holds info about a single rendered line when it was rendered
	    // for measurement, while not in view.
	    d.externalMeasured = null;
	    // Empty space (in pixels) above the view
	    d.viewOffset = 0;
	    d.lastWrapHeight = d.lastWrapWidth = 0;
	    d.updateLineNumbers = null;

	    d.nativeBarWidth = d.barHeight = d.barWidth = 0;
	    d.scrollbarsClipped = false;

	    // Used to only resize the line number gutter when necessary (when
	    // the amount of lines crosses a boundary that makes its width change)
	    d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
	    // Set to true when a non-horizontal-scrolling line widget is
	    // added. As an optimization, line widget aligning is skipped when
	    // this is false.
	    d.alignWidgets = false;

	    d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;

	    // Tracks the maximum line length so that the horizontal scrollbar
	    // can be kept static when scrolling.
	    d.maxLine = null;
	    d.maxLineLength = 0;
	    d.maxLineChanged = false;

	    // Used for measuring wheel scrolling granularity
	    d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;

	    // True when shift is held down.
	    d.shift = false;

	    // Used to track whether anything happened since the context menu
	    // was opened.
	    d.selForContextMenu = null;

	    d.activeTouch = null;

	    input.init(d);
	  }

	  // STATE UPDATES

	  // Used to get the editor into a consistent state again when options change.

	  function loadMode(cm) {
	    cm.doc.mode = CodeMirror.getMode(cm.options, cm.doc.modeOption);
	    resetModeState(cm);
	  }

	  function resetModeState(cm) {
	    cm.doc.iter(function(line) {
	      if (line.stateAfter) line.stateAfter = null;
	      if (line.styles) line.styles = null;
	    });
	    cm.doc.frontier = cm.doc.first;
	    startWorker(cm, 100);
	    cm.state.modeGen++;
	    if (cm.curOp) regChange(cm);
	  }

	  function wrappingChanged(cm) {
	    if (cm.options.lineWrapping) {
	      addClass(cm.display.wrapper, "CodeMirror-wrap");
	      cm.display.sizer.style.minWidth = "";
	      cm.display.sizerWidth = null;
	    } else {
	      rmClass(cm.display.wrapper, "CodeMirror-wrap");
	      findMaxLine(cm);
	    }
	    estimateLineHeights(cm);
	    regChange(cm);
	    clearCaches(cm);
	    setTimeout(function(){updateScrollbars(cm);}, 100);
	  }

	  // Returns a function that estimates the height of a line, to use as
	  // first approximation until the line becomes visible (and is thus
	  // properly measurable).
	  function estimateHeight(cm) {
	    var th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
	    var perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
	    return function(line) {
	      if (lineIsHidden(cm.doc, line)) return 0;

	      var widgetsHeight = 0;
	      if (line.widgets) for (var i = 0; i < line.widgets.length; i++) {
	        if (line.widgets[i].height) widgetsHeight += line.widgets[i].height;
	      }

	      if (wrapping)
	        return widgetsHeight + (Math.ceil(line.text.length / perLine) || 1) * th;
	      else
	        return widgetsHeight + th;
	    };
	  }

	  function estimateLineHeights(cm) {
	    var doc = cm.doc, est = estimateHeight(cm);
	    doc.iter(function(line) {
	      var estHeight = est(line);
	      if (estHeight != line.height) updateLineHeight(line, estHeight);
	    });
	  }

	  function themeChanged(cm) {
	    cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") +
	      cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
	    clearCaches(cm);
	  }

	  function guttersChanged(cm) {
	    updateGutters(cm);
	    regChange(cm);
	    setTimeout(function(){alignHorizontally(cm);}, 20);
	  }

	  // Rebuild the gutter elements, ensure the margin to the left of the
	  // code matches their width.
	  function updateGutters(cm) {
	    var gutters = cm.display.gutters, specs = cm.options.gutters;
	    removeChildren(gutters);
	    for (var i = 0; i < specs.length; ++i) {
	      var gutterClass = specs[i];
	      var gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + gutterClass));
	      if (gutterClass == "CodeMirror-linenumbers") {
	        cm.display.lineGutter = gElt;
	        gElt.style.width = (cm.display.lineNumWidth || 1) + "px";
	      }
	    }
	    gutters.style.display = i ? "" : "none";
	    updateGutterSpace(cm);
	  }

	  function updateGutterSpace(cm) {
	    var width = cm.display.gutters.offsetWidth;
	    cm.display.sizer.style.marginLeft = width + "px";
	  }

	  // Compute the character length of a line, taking into account
	  // collapsed ranges (see markText) that might hide parts, and join
	  // other lines onto it.
	  function lineLength(line) {
	    if (line.height == 0) return 0;
	    var len = line.text.length, merged, cur = line;
	    while (merged = collapsedSpanAtStart(cur)) {
	      var found = merged.find(0, true);
	      cur = found.from.line;
	      len += found.from.ch - found.to.ch;
	    }
	    cur = line;
	    while (merged = collapsedSpanAtEnd(cur)) {
	      var found = merged.find(0, true);
	      len -= cur.text.length - found.from.ch;
	      cur = found.to.line;
	      len += cur.text.length - found.to.ch;
	    }
	    return len;
	  }

	  // Find the longest line in the document.
	  function findMaxLine(cm) {
	    var d = cm.display, doc = cm.doc;
	    d.maxLine = getLine(doc, doc.first);
	    d.maxLineLength = lineLength(d.maxLine);
	    d.maxLineChanged = true;
	    doc.iter(function(line) {
	      var len = lineLength(line);
	      if (len > d.maxLineLength) {
	        d.maxLineLength = len;
	        d.maxLine = line;
	      }
	    });
	  }

	  // Make sure the gutters options contains the element
	  // "CodeMirror-linenumbers" when the lineNumbers option is true.
	  function setGuttersForLineNumbers(options) {
	    var found = indexOf(options.gutters, "CodeMirror-linenumbers");
	    if (found == -1 && options.lineNumbers) {
	      options.gutters = options.gutters.concat(["CodeMirror-linenumbers"]);
	    } else if (found > -1 && !options.lineNumbers) {
	      options.gutters = options.gutters.slice(0);
	      options.gutters.splice(found, 1);
	    }
	  }

	  // SCROLLBARS

	  // Prepare DOM reads needed to update the scrollbars. Done in one
	  // shot to minimize update/measure roundtrips.
	  function measureForScrollbars(cm) {
	    var d = cm.display, gutterW = d.gutters.offsetWidth;
	    var docH = Math.round(cm.doc.height + paddingVert(cm.display));
	    return {
	      clientHeight: d.scroller.clientHeight,
	      viewHeight: d.wrapper.clientHeight,
	      scrollWidth: d.scroller.scrollWidth, clientWidth: d.scroller.clientWidth,
	      viewWidth: d.wrapper.clientWidth,
	      barLeft: cm.options.fixedGutter ? gutterW : 0,
	      docHeight: docH,
	      scrollHeight: docH + scrollGap(cm) + d.barHeight,
	      nativeBarWidth: d.nativeBarWidth,
	      gutterWidth: gutterW
	    };
	  }

	  function NativeScrollbars(place, scroll, cm) {
	    this.cm = cm;
	    var vert = this.vert = elt("div", [elt("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar");
	    var horiz = this.horiz = elt("div", [elt("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
	    place(vert); place(horiz);

	    on(vert, "scroll", function() {
	      if (vert.clientHeight) scroll(vert.scrollTop, "vertical");
	    });
	    on(horiz, "scroll", function() {
	      if (horiz.clientWidth) scroll(horiz.scrollLeft, "horizontal");
	    });

	    this.checkedZeroWidth = false;
	    // Need to set a minimum width to see the scrollbar on IE7 (but must not set it on IE8).
	    if (ie && ie_version < 8) this.horiz.style.minHeight = this.vert.style.minWidth = "18px";
	  }

	  NativeScrollbars.prototype = copyObj({
	    update: function(measure) {
	      var needsH = measure.scrollWidth > measure.clientWidth + 1;
	      var needsV = measure.scrollHeight > measure.clientHeight + 1;
	      var sWidth = measure.nativeBarWidth;

	      if (needsV) {
	        this.vert.style.display = "block";
	        this.vert.style.bottom = needsH ? sWidth + "px" : "0";
	        var totalHeight = measure.viewHeight - (needsH ? sWidth : 0);
	        // A bug in IE8 can cause this value to be negative, so guard it.
	        this.vert.firstChild.style.height =
	          Math.max(0, measure.scrollHeight - measure.clientHeight + totalHeight) + "px";
	      } else {
	        this.vert.style.display = "";
	        this.vert.firstChild.style.height = "0";
	      }

	      if (needsH) {
	        this.horiz.style.display = "block";
	        this.horiz.style.right = needsV ? sWidth + "px" : "0";
	        this.horiz.style.left = measure.barLeft + "px";
	        var totalWidth = measure.viewWidth - measure.barLeft - (needsV ? sWidth : 0);
	        this.horiz.firstChild.style.width =
	          (measure.scrollWidth - measure.clientWidth + totalWidth) + "px";
	      } else {
	        this.horiz.style.display = "";
	        this.horiz.firstChild.style.width = "0";
	      }

	      if (!this.checkedZeroWidth && measure.clientHeight > 0) {
	        if (sWidth == 0) this.zeroWidthHack();
	        this.checkedZeroWidth = true;
	      }

	      return {right: needsV ? sWidth : 0, bottom: needsH ? sWidth : 0};
	    },
	    setScrollLeft: function(pos) {
	      if (this.horiz.scrollLeft != pos) this.horiz.scrollLeft = pos;
	      if (this.disableHoriz) this.enableZeroWidthBar(this.horiz, this.disableHoriz);
	    },
	    setScrollTop: function(pos) {
	      if (this.vert.scrollTop != pos) this.vert.scrollTop = pos;
	      if (this.disableVert) this.enableZeroWidthBar(this.vert, this.disableVert);
	    },
	    zeroWidthHack: function() {
	      var w = mac && !mac_geMountainLion ? "12px" : "18px";
	      this.horiz.style.height = this.vert.style.width = w;
	      this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none";
	      this.disableHoriz = new Delayed;
	      this.disableVert = new Delayed;
	    },
	    enableZeroWidthBar: function(bar, delay) {
	      bar.style.pointerEvents = "auto";
	      function maybeDisable() {
	        // To find out whether the scrollbar is still visible, we
	        // check whether the element under the pixel in the bottom
	        // left corner of the scrollbar box is the scrollbar box
	        // itself (when the bar is still visible) or its filler child
	        // (when the bar is hidden). If it is still visible, we keep
	        // it enabled, if it's hidden, we disable pointer events.
	        var box = bar.getBoundingClientRect();
	        var elt = document.elementFromPoint(box.left + 1, box.bottom - 1);
	        if (elt != bar) bar.style.pointerEvents = "none";
	        else delay.set(1000, maybeDisable);
	      }
	      delay.set(1000, maybeDisable);
	    },
	    clear: function() {
	      var parent = this.horiz.parentNode;
	      parent.removeChild(this.horiz);
	      parent.removeChild(this.vert);
	    }
	  }, NativeScrollbars.prototype);

	  function NullScrollbars() {}

	  NullScrollbars.prototype = copyObj({
	    update: function() { return {bottom: 0, right: 0}; },
	    setScrollLeft: function() {},
	    setScrollTop: function() {},
	    clear: function() {}
	  }, NullScrollbars.prototype);

	  CodeMirror.scrollbarModel = {"native": NativeScrollbars, "null": NullScrollbars};

	  function initScrollbars(cm) {
	    if (cm.display.scrollbars) {
	      cm.display.scrollbars.clear();
	      if (cm.display.scrollbars.addClass)
	        rmClass(cm.display.wrapper, cm.display.scrollbars.addClass);
	    }

	    cm.display.scrollbars = new CodeMirror.scrollbarModel[cm.options.scrollbarStyle](function(node) {
	      cm.display.wrapper.insertBefore(node, cm.display.scrollbarFiller);
	      // Prevent clicks in the scrollbars from killing focus
	      on(node, "mousedown", function() {
	        if (cm.state.focused) setTimeout(function() { cm.display.input.focus(); }, 0);
	      });
	      node.setAttribute("cm-not-content", "true");
	    }, function(pos, axis) {
	      if (axis == "horizontal") setScrollLeft(cm, pos);
	      else setScrollTop(cm, pos);
	    }, cm);
	    if (cm.display.scrollbars.addClass)
	      addClass(cm.display.wrapper, cm.display.scrollbars.addClass);
	  }

	  function updateScrollbars(cm, measure) {
	    if (!measure) measure = measureForScrollbars(cm);
	    var startWidth = cm.display.barWidth, startHeight = cm.display.barHeight;
	    updateScrollbarsInner(cm, measure);
	    for (var i = 0; i < 4 && startWidth != cm.display.barWidth || startHeight != cm.display.barHeight; i++) {
	      if (startWidth != cm.display.barWidth && cm.options.lineWrapping)
	        updateHeightsInViewport(cm);
	      updateScrollbarsInner(cm, measureForScrollbars(cm));
	      startWidth = cm.display.barWidth; startHeight = cm.display.barHeight;
	    }
	  }

	  // Re-synchronize the fake scrollbars with the actual size of the
	  // content.
	  function updateScrollbarsInner(cm, measure) {
	    var d = cm.display;
	    var sizes = d.scrollbars.update(measure);

	    d.sizer.style.paddingRight = (d.barWidth = sizes.right) + "px";
	    d.sizer.style.paddingBottom = (d.barHeight = sizes.bottom) + "px";
	    d.heightForcer.style.borderBottom = sizes.bottom + "px solid transparent"

	    if (sizes.right && sizes.bottom) {
	      d.scrollbarFiller.style.display = "block";
	      d.scrollbarFiller.style.height = sizes.bottom + "px";
	      d.scrollbarFiller.style.width = sizes.right + "px";
	    } else d.scrollbarFiller.style.display = "";
	    if (sizes.bottom && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
	      d.gutterFiller.style.display = "block";
	      d.gutterFiller.style.height = sizes.bottom + "px";
	      d.gutterFiller.style.width = measure.gutterWidth + "px";
	    } else d.gutterFiller.style.display = "";
	  }

	  // Compute the lines that are visible in a given viewport (defaults
	  // the the current scroll position). viewport may contain top,
	  // height, and ensure (see op.scrollToPos) properties.
	  function visibleLines(display, doc, viewport) {
	    var top = viewport && viewport.top != null ? Math.max(0, viewport.top) : display.scroller.scrollTop;
	    top = Math.floor(top - paddingTop(display));
	    var bottom = viewport && viewport.bottom != null ? viewport.bottom : top + display.wrapper.clientHeight;

	    var from = lineAtHeight(doc, top), to = lineAtHeight(doc, bottom);
	    // Ensure is a {from: {line, ch}, to: {line, ch}} object, and
	    // forces those lines into the viewport (if possible).
	    if (viewport && viewport.ensure) {
	      var ensureFrom = viewport.ensure.from.line, ensureTo = viewport.ensure.to.line;
	      if (ensureFrom < from) {
	        from = ensureFrom;
	        to = lineAtHeight(doc, heightAtLine(getLine(doc, ensureFrom)) + display.wrapper.clientHeight);
	      } else if (Math.min(ensureTo, doc.lastLine()) >= to) {
	        from = lineAtHeight(doc, heightAtLine(getLine(doc, ensureTo)) - display.wrapper.clientHeight);
	        to = ensureTo;
	      }
	    }
	    return {from: from, to: Math.max(to, from + 1)};
	  }

	  // LINE NUMBERS

	  // Re-align line numbers and gutter marks to compensate for
	  // horizontal scrolling.
	  function alignHorizontally(cm) {
	    var display = cm.display, view = display.view;
	    if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) return;
	    var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
	    var gutterW = display.gutters.offsetWidth, left = comp + "px";
	    for (var i = 0; i < view.length; i++) if (!view[i].hidden) {
	      if (cm.options.fixedGutter) {
	        if (view[i].gutter)
	          view[i].gutter.style.left = left;
	        if (view[i].gutterBackground)
	          view[i].gutterBackground.style.left = left;
	      }
	      var align = view[i].alignable;
	      if (align) for (var j = 0; j < align.length; j++)
	        align[j].style.left = left;
	    }
	    if (cm.options.fixedGutter)
	      display.gutters.style.left = (comp + gutterW) + "px";
	  }

	  // Used to ensure that the line number gutter is still the right
	  // size for the current document size. Returns true when an update
	  // is needed.
	  function maybeUpdateLineNumberWidth(cm) {
	    if (!cm.options.lineNumbers) return false;
	    var doc = cm.doc, last = lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
	    if (last.length != display.lineNumChars) {
	      var test = display.measure.appendChild(elt("div", [elt("div", last)],
	                                                 "CodeMirror-linenumber CodeMirror-gutter-elt"));
	      var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
	      display.lineGutter.style.width = "";
	      display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding) + 1;
	      display.lineNumWidth = display.lineNumInnerWidth + padding;
	      display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
	      display.lineGutter.style.width = display.lineNumWidth + "px";
	      updateGutterSpace(cm);
	      return true;
	    }
	    return false;
	  }

	  function lineNumberFor(options, i) {
	    return String(options.lineNumberFormatter(i + options.firstLineNumber));
	  }

	  // Computes display.scroller.scrollLeft + display.gutters.offsetWidth,
	  // but using getBoundingClientRect to get a sub-pixel-accurate
	  // result.
	  function compensateForHScroll(display) {
	    return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left;
	  }

	  // DISPLAY DRAWING

	  function DisplayUpdate(cm, viewport, force) {
	    var display = cm.display;

	    this.viewport = viewport;
	    // Store some values that we'll need later (but don't want to force a relayout for)
	    this.visible = visibleLines(display, cm.doc, viewport);
	    this.editorIsHidden = !display.wrapper.offsetWidth;
	    this.wrapperHeight = display.wrapper.clientHeight;
	    this.wrapperWidth = display.wrapper.clientWidth;
	    this.oldDisplayWidth = displayWidth(cm);
	    this.force = force;
	    this.dims = getDimensions(cm);
	    this.events = [];
	  }

	  DisplayUpdate.prototype.signal = function(emitter, type) {
	    if (hasHandler(emitter, type))
	      this.events.push(arguments);
	  };
	  DisplayUpdate.prototype.finish = function() {
	    for (var i = 0; i < this.events.length; i++)
	      signal.apply(null, this.events[i]);
	  };

	  function maybeClipScrollbars(cm) {
	    var display = cm.display;
	    if (!display.scrollbarsClipped && display.scroller.offsetWidth) {
	      display.nativeBarWidth = display.scroller.offsetWidth - display.scroller.clientWidth;
	      display.heightForcer.style.height = scrollGap(cm) + "px";
	      display.sizer.style.marginBottom = -display.nativeBarWidth + "px";
	      display.sizer.style.borderRightWidth = scrollGap(cm) + "px";
	      display.scrollbarsClipped = true;
	    }
	  }

	  // Does the actual updating of the line display. Bails out
	  // (returning false) when there is nothing to be done and forced is
	  // false.
	  function updateDisplayIfNeeded(cm, update) {
	    var display = cm.display, doc = cm.doc;

	    if (update.editorIsHidden) {
	      resetView(cm);
	      return false;
	    }

	    // Bail out if the visible area is already rendered and nothing changed.
	    if (!update.force &&
	        update.visible.from >= display.viewFrom && update.visible.to <= display.viewTo &&
	        (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo) &&
	        display.renderedView == display.view && countDirtyView(cm) == 0)
	      return false;

	    if (maybeUpdateLineNumberWidth(cm)) {
	      resetView(cm);
	      update.dims = getDimensions(cm);
	    }

	    // Compute a suitable new viewport (from & to)
	    var end = doc.first + doc.size;
	    var from = Math.max(update.visible.from - cm.options.viewportMargin, doc.first);
	    var to = Math.min(end, update.visible.to + cm.options.viewportMargin);
	    if (display.viewFrom < from && from - display.viewFrom < 20) from = Math.max(doc.first, display.viewFrom);
	    if (display.viewTo > to && display.viewTo - to < 20) to = Math.min(end, display.viewTo);
	    if (sawCollapsedSpans) {
	      from = visualLineNo(cm.doc, from);
	      to = visualLineEndNo(cm.doc, to);
	    }

	    var different = from != display.viewFrom || to != display.viewTo ||
	      display.lastWrapHeight != update.wrapperHeight || display.lastWrapWidth != update.wrapperWidth;
	    adjustView(cm, from, to);

	    display.viewOffset = heightAtLine(getLine(cm.doc, display.viewFrom));
	    // Position the mover div to align with the current scroll position
	    cm.display.mover.style.top = display.viewOffset + "px";

	    var toUpdate = countDirtyView(cm);
	    if (!different && toUpdate == 0 && !update.force && display.renderedView == display.view &&
	        (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo))
	      return false;

	    // For big changes, we hide the enclosing element during the
	    // update, since that speeds up the operations on most browsers.
	    var focused = activeElt();
	    if (toUpdate > 4) display.lineDiv.style.display = "none";
	    patchDisplay(cm, display.updateLineNumbers, update.dims);
	    if (toUpdate > 4) display.lineDiv.style.display = "";
	    display.renderedView = display.view;
	    // There might have been a widget with a focused element that got
	    // hidden or updated, if so re-focus it.
	    if (focused && activeElt() != focused && focused.offsetHeight) focused.focus();

	    // Prevent selection and cursors from interfering with the scroll
	    // width and height.
	    removeChildren(display.cursorDiv);
	    removeChildren(display.selectionDiv);
	    display.gutters.style.height = display.sizer.style.minHeight = 0;

	    if (different) {
	      display.lastWrapHeight = update.wrapperHeight;
	      display.lastWrapWidth = update.wrapperWidth;
	      startWorker(cm, 400);
	    }

	    display.updateLineNumbers = null;

	    return true;
	  }

	  function postUpdateDisplay(cm, update) {
	    var viewport = update.viewport;

	    for (var first = true;; first = false) {
	      if (!first || !cm.options.lineWrapping || update.oldDisplayWidth == displayWidth(cm)) {
	        // Clip forced viewport to actual scrollable area.
	        if (viewport && viewport.top != null)
	          viewport = {top: Math.min(cm.doc.height + paddingVert(cm.display) - displayHeight(cm), viewport.top)};
	        // Updated line heights might result in the drawn area not
	        // actually covering the viewport. Keep looping until it does.
	        update.visible = visibleLines(cm.display, cm.doc, viewport);
	        if (update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo)
	          break;
	      }
	      if (!updateDisplayIfNeeded(cm, update)) break;
	      updateHeightsInViewport(cm);
	      var barMeasure = measureForScrollbars(cm);
	      updateSelection(cm);
	      updateScrollbars(cm, barMeasure);
	      setDocumentHeight(cm, barMeasure);
	    }

	    update.signal(cm, "update", cm);
	    if (cm.display.viewFrom != cm.display.reportedViewFrom || cm.display.viewTo != cm.display.reportedViewTo) {
	      update.signal(cm, "viewportChange", cm, cm.display.viewFrom, cm.display.viewTo);
	      cm.display.reportedViewFrom = cm.display.viewFrom; cm.display.reportedViewTo = cm.display.viewTo;
	    }
	  }

	  function updateDisplaySimple(cm, viewport) {
	    var update = new DisplayUpdate(cm, viewport);
	    if (updateDisplayIfNeeded(cm, update)) {
	      updateHeightsInViewport(cm);
	      postUpdateDisplay(cm, update);
	      var barMeasure = measureForScrollbars(cm);
	      updateSelection(cm);
	      updateScrollbars(cm, barMeasure);
	      setDocumentHeight(cm, barMeasure);
	      update.finish();
	    }
	  }

	  function setDocumentHeight(cm, measure) {
	    cm.display.sizer.style.minHeight = measure.docHeight + "px";
	    cm.display.heightForcer.style.top = measure.docHeight + "px";
	    cm.display.gutters.style.height = (measure.docHeight + cm.display.barHeight + scrollGap(cm)) + "px";
	  }

	  // Read the actual heights of the rendered lines, and update their
	  // stored heights to match.
	  function updateHeightsInViewport(cm) {
	    var display = cm.display;
	    var prevBottom = display.lineDiv.offsetTop;
	    for (var i = 0; i < display.view.length; i++) {
	      var cur = display.view[i], height;
	      if (cur.hidden) continue;
	      if (ie && ie_version < 8) {
	        var bot = cur.node.offsetTop + cur.node.offsetHeight;
	        height = bot - prevBottom;
	        prevBottom = bot;
	      } else {
	        var box = cur.node.getBoundingClientRect();
	        height = box.bottom - box.top;
	      }
	      var diff = cur.line.height - height;
	      if (height < 2) height = textHeight(display);
	      if (diff > .001 || diff < -.001) {
	        updateLineHeight(cur.line, height);
	        updateWidgetHeight(cur.line);
	        if (cur.rest) for (var j = 0; j < cur.rest.length; j++)
	          updateWidgetHeight(cur.rest[j]);
	      }
	    }
	  }

	  // Read and store the height of line widgets associated with the
	  // given line.
	  function updateWidgetHeight(line) {
	    if (line.widgets) for (var i = 0; i < line.widgets.length; ++i)
	      line.widgets[i].height = line.widgets[i].node.parentNode.offsetHeight;
	  }

	  // Do a bulk-read of the DOM positions and sizes needed to draw the
	  // view, so that we don't interleave reading and writing to the DOM.
	  function getDimensions(cm) {
	    var d = cm.display, left = {}, width = {};
	    var gutterLeft = d.gutters.clientLeft;
	    for (var n = d.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i) {
	      left[cm.options.gutters[i]] = n.offsetLeft + n.clientLeft + gutterLeft;
	      width[cm.options.gutters[i]] = n.clientWidth;
	    }
	    return {fixedPos: compensateForHScroll(d),
	            gutterTotalWidth: d.gutters.offsetWidth,
	            gutterLeft: left,
	            gutterWidth: width,
	            wrapperWidth: d.wrapper.clientWidth};
	  }

	  // Sync the actual display DOM structure with display.view, removing
	  // nodes for lines that are no longer in view, and creating the ones
	  // that are not there yet, and updating the ones that are out of
	  // date.
	  function patchDisplay(cm, updateNumbersFrom, dims) {
	    var display = cm.display, lineNumbers = cm.options.lineNumbers;
	    var container = display.lineDiv, cur = container.firstChild;

	    function rm(node) {
	      var next = node.nextSibling;
	      // Works around a throw-scroll bug in OS X Webkit
	      if (webkit && mac && cm.display.currentWheelTarget == node)
	        node.style.display = "none";
	      else
	        node.parentNode.removeChild(node);
	      return next;
	    }

	    var view = display.view, lineN = display.viewFrom;
	    // Loop over the elements in the view, syncing cur (the DOM nodes
	    // in display.lineDiv) with the view as we go.
	    for (var i = 0; i < view.length; i++) {
	      var lineView = view[i];
	      if (lineView.hidden) {
	      } else if (!lineView.node || lineView.node.parentNode != container) { // Not drawn yet
	        var node = buildLineElement(cm, lineView, lineN, dims);
	        container.insertBefore(node, cur);
	      } else { // Already drawn
	        while (cur != lineView.node) cur = rm(cur);
	        var updateNumber = lineNumbers && updateNumbersFrom != null &&
	          updateNumbersFrom <= lineN && lineView.lineNumber;
	        if (lineView.changes) {
	          if (indexOf(lineView.changes, "gutter") > -1) updateNumber = false;
	          updateLineForChanges(cm, lineView, lineN, dims);
	        }
	        if (updateNumber) {
	          removeChildren(lineView.lineNumber);
	          lineView.lineNumber.appendChild(document.createTextNode(lineNumberFor(cm.options, lineN)));
	        }
	        cur = lineView.node.nextSibling;
	      }
	      lineN += lineView.size;
	    }
	    while (cur) cur = rm(cur);
	  }

	  // When an aspect of a line changes, a string is added to
	  // lineView.changes. This updates the relevant part of the line's
	  // DOM structure.
	  function updateLineForChanges(cm, lineView, lineN, dims) {
	    for (var j = 0; j < lineView.changes.length; j++) {
	      var type = lineView.changes[j];
	      if (type == "text") updateLineText(cm, lineView);
	      else if (type == "gutter") updateLineGutter(cm, lineView, lineN, dims);
	      else if (type == "class") updateLineClasses(lineView);
	      else if (type == "widget") updateLineWidgets(cm, lineView, dims);
	    }
	    lineView.changes = null;
	  }

	  // Lines with gutter elements, widgets or a background class need to
	  // be wrapped, and have the extra elements added to the wrapper div
	  function ensureLineWrapped(lineView) {
	    if (lineView.node == lineView.text) {
	      lineView.node = elt("div", null, null, "position: relative");
	      if (lineView.text.parentNode)
	        lineView.text.parentNode.replaceChild(lineView.node, lineView.text);
	      lineView.node.appendChild(lineView.text);
	      if (ie && ie_version < 8) lineView.node.style.zIndex = 2;
	    }
	    return lineView.node;
	  }

	  function updateLineBackground(lineView) {
	    var cls = lineView.bgClass ? lineView.bgClass + " " + (lineView.line.bgClass || "") : lineView.line.bgClass;
	    if (cls) cls += " CodeMirror-linebackground";
	    if (lineView.background) {
	      if (cls) lineView.background.className = cls;
	      else { lineView.background.parentNode.removeChild(lineView.background); lineView.background = null; }
	    } else if (cls) {
	      var wrap = ensureLineWrapped(lineView);
	      lineView.background = wrap.insertBefore(elt("div", null, cls), wrap.firstChild);
	    }
	  }

	  // Wrapper around buildLineContent which will reuse the structure
	  // in display.externalMeasured when possible.
	  function getLineContent(cm, lineView) {
	    var ext = cm.display.externalMeasured;
	    if (ext && ext.line == lineView.line) {
	      cm.display.externalMeasured = null;
	      lineView.measure = ext.measure;
	      return ext.built;
	    }
	    return buildLineContent(cm, lineView);
	  }

	  // Redraw the line's text. Interacts with the background and text
	  // classes because the mode may output tokens that influence these
	  // classes.
	  function updateLineText(cm, lineView) {
	    var cls = lineView.text.className;
	    var built = getLineContent(cm, lineView);
	    if (lineView.text == lineView.node) lineView.node = built.pre;
	    lineView.text.parentNode.replaceChild(built.pre, lineView.text);
	    lineView.text = built.pre;
	    if (built.bgClass != lineView.bgClass || built.textClass != lineView.textClass) {
	      lineView.bgClass = built.bgClass;
	      lineView.textClass = built.textClass;
	      updateLineClasses(lineView);
	    } else if (cls) {
	      lineView.text.className = cls;
	    }
	  }

	  function updateLineClasses(lineView) {
	    updateLineBackground(lineView);
	    if (lineView.line.wrapClass)
	      ensureLineWrapped(lineView).className = lineView.line.wrapClass;
	    else if (lineView.node != lineView.text)
	      lineView.node.className = "";
	    var textClass = lineView.textClass ? lineView.textClass + " " + (lineView.line.textClass || "") : lineView.line.textClass;
	    lineView.text.className = textClass || "";
	  }

	  function updateLineGutter(cm, lineView, lineN, dims) {
	    if (lineView.gutter) {
	      lineView.node.removeChild(lineView.gutter);
	      lineView.gutter = null;
	    }
	    if (lineView.gutterBackground) {
	      lineView.node.removeChild(lineView.gutterBackground);
	      lineView.gutterBackground = null;
	    }
	    if (lineView.line.gutterClass) {
	      var wrap = ensureLineWrapped(lineView);
	      lineView.gutterBackground = elt("div", null, "CodeMirror-gutter-background " + lineView.line.gutterClass,
	                                      "left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) +
	                                      "px; width: " + dims.gutterTotalWidth + "px");
	      wrap.insertBefore(lineView.gutterBackground, lineView.text);
	    }
	    var markers = lineView.line.gutterMarkers;
	    if (cm.options.lineNumbers || markers) {
	      var wrap = ensureLineWrapped(lineView);
	      var gutterWrap = lineView.gutter = elt("div", null, "CodeMirror-gutter-wrapper", "left: " +
	                                             (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px");
	      cm.display.input.setUneditable(gutterWrap);
	      wrap.insertBefore(gutterWrap, lineView.text);
	      if (lineView.line.gutterClass)
	        gutterWrap.className += " " + lineView.line.gutterClass;
	      if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"]))
	        lineView.lineNumber = gutterWrap.appendChild(
	          elt("div", lineNumberFor(cm.options, lineN),
	              "CodeMirror-linenumber CodeMirror-gutter-elt",
	              "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: "
	              + cm.display.lineNumInnerWidth + "px"));
	      if (markers) for (var k = 0; k < cm.options.gutters.length; ++k) {
	        var id = cm.options.gutters[k], found = markers.hasOwnProperty(id) && markers[id];
	        if (found)
	          gutterWrap.appendChild(elt("div", [found], "CodeMirror-gutter-elt", "left: " +
	                                     dims.gutterLeft[id] + "px; width: " + dims.gutterWidth[id] + "px"));
	      }
	    }
	  }

	  function updateLineWidgets(cm, lineView, dims) {
	    if (lineView.alignable) lineView.alignable = null;
	    for (var node = lineView.node.firstChild, next; node; node = next) {
	      var next = node.nextSibling;
	      if (node.className == "CodeMirror-linewidget")
	        lineView.node.removeChild(node);
	    }
	    insertLineWidgets(cm, lineView, dims);
	  }

	  // Build a line's DOM representation from scratch
	  function buildLineElement(cm, lineView, lineN, dims) {
	    var built = getLineContent(cm, lineView);
	    lineView.text = lineView.node = built.pre;
	    if (built.bgClass) lineView.bgClass = built.bgClass;
	    if (built.textClass) lineView.textClass = built.textClass;

	    updateLineClasses(lineView);
	    updateLineGutter(cm, lineView, lineN, dims);
	    insertLineWidgets(cm, lineView, dims);
	    return lineView.node;
	  }

	  // A lineView may contain multiple logical lines (when merged by
	  // collapsed spans). The widgets for all of them need to be drawn.
	  function insertLineWidgets(cm, lineView, dims) {
	    insertLineWidgetsFor(cm, lineView.line, lineView, dims, true);
	    if (lineView.rest) for (var i = 0; i < lineView.rest.length; i++)
	      insertLineWidgetsFor(cm, lineView.rest[i], lineView, dims, false);
	  }

	  function insertLineWidgetsFor(cm, line, lineView, dims, allowAbove) {
	    if (!line.widgets) return;
	    var wrap = ensureLineWrapped(lineView);
	    for (var i = 0, ws = line.widgets; i < ws.length; ++i) {
	      var widget = ws[i], node = elt("div", [widget.node], "CodeMirror-linewidget");
	      if (!widget.handleMouseEvents) node.setAttribute("cm-ignore-events", "true");
	      positionLineWidget(widget, node, lineView, dims);
	      cm.display.input.setUneditable(node);
	      if (allowAbove && widget.above)
	        wrap.insertBefore(node, lineView.gutter || lineView.text);
	      else
	        wrap.appendChild(node);
	      signalLater(widget, "redraw");
	    }
	  }

	  function positionLineWidget(widget, node, lineView, dims) {
	    if (widget.noHScroll) {
	      (lineView.alignable || (lineView.alignable = [])).push(node);
	      var width = dims.wrapperWidth;
	      node.style.left = dims.fixedPos + "px";
	      if (!widget.coverGutter) {
	        width -= dims.gutterTotalWidth;
	        node.style.paddingLeft = dims.gutterTotalWidth + "px";
	      }
	      node.style.width = width + "px";
	    }
	    if (widget.coverGutter) {
	      node.style.zIndex = 5;
	      node.style.position = "relative";
	      if (!widget.noHScroll) node.style.marginLeft = -dims.gutterTotalWidth + "px";
	    }
	  }

	  // POSITION OBJECT

	  // A Pos instance represents a position within the text.
	  var Pos = CodeMirror.Pos = function(line, ch) {
	    if (!(this instanceof Pos)) return new Pos(line, ch);
	    this.line = line; this.ch = ch;
	  };

	  // Compare two positions, return 0 if they are the same, a negative
	  // number when a is less, and a positive number otherwise.
	  var cmp = CodeMirror.cmpPos = function(a, b) { return a.line - b.line || a.ch - b.ch; };

	  function copyPos(x) {return Pos(x.line, x.ch);}
	  function maxPos(a, b) { return cmp(a, b) < 0 ? b : a; }
	  function minPos(a, b) { return cmp(a, b) < 0 ? a : b; }

	  // INPUT HANDLING

	  function ensureFocus(cm) {
	    if (!cm.state.focused) { cm.display.input.focus(); onFocus(cm); }
	  }

	  // This will be set to a {lineWise: bool, text: [string]} object, so
	  // that, when pasting, we know what kind of selections the copied
	  // text was made out of.
	  var lastCopied = null;

	  function applyTextInput(cm, inserted, deleted, sel, origin) {
	    var doc = cm.doc;
	    cm.display.shift = false;
	    if (!sel) sel = doc.sel;

	    var paste = cm.state.pasteIncoming || origin == "paste";
	    var textLines = doc.splitLines(inserted), multiPaste = null
	    // When pasing N lines into N selections, insert one line per selection
	    if (paste && sel.ranges.length > 1) {
	      if (lastCopied && lastCopied.text.join("\n") == inserted) {
	        if (sel.ranges.length % lastCopied.text.length == 0) {
	          multiPaste = [];
	          for (var i = 0; i < lastCopied.text.length; i++)
	            multiPaste.push(doc.splitLines(lastCopied.text[i]));
	        }
	      } else if (textLines.length == sel.ranges.length) {
	        multiPaste = map(textLines, function(l) { return [l]; });
	      }
	    }

	    // Normal behavior is to insert the new text into every selection
	    for (var i = sel.ranges.length - 1; i >= 0; i--) {
	      var range = sel.ranges[i];
	      var from = range.from(), to = range.to();
	      if (range.empty()) {
	        if (deleted && deleted > 0) // Handle deletion
	          from = Pos(from.line, from.ch - deleted);
	        else if (cm.state.overwrite && !paste) // Handle overwrite
	          to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + lst(textLines).length));
	        else if (lastCopied && lastCopied.lineWise && lastCopied.text.join("\n") == inserted)
	          from = to = Pos(from.line, 0)
	      }
	      var updateInput = cm.curOp.updateInput;
	      var changeEvent = {from: from, to: to, text: multiPaste ? multiPaste[i % multiPaste.length] : textLines,
	                         origin: origin || (paste ? "paste" : cm.state.cutIncoming ? "cut" : "+input")};
	      makeChange(cm.doc, changeEvent);
	      signalLater(cm, "inputRead", cm, changeEvent);
	    }
	    if (inserted && !paste)
	      triggerElectric(cm, inserted);

	    ensureCursorVisible(cm);
	    cm.curOp.updateInput = updateInput;
	    cm.curOp.typing = true;
	    cm.state.pasteIncoming = cm.state.cutIncoming = false;
	  }

	  function handlePaste(e, cm) {
	    var pasted = e.clipboardData && e.clipboardData.getData("Text");
	    if (pasted) {
	      e.preventDefault();
	      if (!cm.isReadOnly() && !cm.options.disableInput)
	        runInOp(cm, function() { applyTextInput(cm, pasted, 0, null, "paste"); });
	      return true;
	    }
	  }

	  function triggerElectric(cm, inserted) {
	    // When an 'electric' character is inserted, immediately trigger a reindent
	    if (!cm.options.electricChars || !cm.options.smartIndent) return;
	    var sel = cm.doc.sel;

	    for (var i = sel.ranges.length - 1; i >= 0; i--) {
	      var range = sel.ranges[i];
	      if (range.head.ch > 100 || (i && sel.ranges[i - 1].head.line == range.head.line)) continue;
	      var mode = cm.getModeAt(range.head);
	      var indented = false;
	      if (mode.electricChars) {
	        for (var j = 0; j < mode.electricChars.length; j++)
	          if (inserted.indexOf(mode.electricChars.charAt(j)) > -1) {
	            indented = indentLine(cm, range.head.line, "smart");
	            break;
	          }
	      } else if (mode.electricInput) {
	        if (mode.electricInput.test(getLine(cm.doc, range.head.line).text.slice(0, range.head.ch)))
	          indented = indentLine(cm, range.head.line, "smart");
	      }
	      if (indented) signalLater(cm, "electricInput", cm, range.head.line);
	    }
	  }

	  function copyableRanges(cm) {
	    var text = [], ranges = [];
	    for (var i = 0; i < cm.doc.sel.ranges.length; i++) {
	      var line = cm.doc.sel.ranges[i].head.line;
	      var lineRange = {anchor: Pos(line, 0), head: Pos(line + 1, 0)};
	      ranges.push(lineRange);
	      text.push(cm.getRange(lineRange.anchor, lineRange.head));
	    }
	    return {text: text, ranges: ranges};
	  }

	  function disableBrowserMagic(field, spellcheck) {
	    field.setAttribute("autocorrect", "off");
	    field.setAttribute("autocapitalize", "off");
	    field.setAttribute("spellcheck", !!spellcheck);
	  }

	  // TEXTAREA INPUT STYLE

	  function TextareaInput(cm) {
	    this.cm = cm;
	    // See input.poll and input.reset
	    this.prevInput = "";

	    // Flag that indicates whether we expect input to appear real soon
	    // now (after some event like 'keypress' or 'input') and are
	    // polling intensively.
	    this.pollingFast = false;
	    // Self-resetting timeout for the poller
	    this.polling = new Delayed();
	    // Tracks when input.reset has punted to just putting a short
	    // string into the textarea instead of the full selection.
	    this.inaccurateSelection = false;
	    // Used to work around IE issue with selection being forgotten when focus moves away from textarea
	    this.hasSelection = false;
	    this.composing = null;
	  };

	  function hiddenTextarea() {
	    var te = elt("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none");
	    var div = elt("div", [te], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
	    // The textarea is kept positioned near the cursor to prevent the
	    // fact that it'll be scrolled into view on input from scrolling
	    // our fake cursor out of view. On webkit, when wrap=off, paste is
	    // very slow. So make the area wide instead.
	    if (webkit) te.style.width = "1000px";
	    else te.setAttribute("wrap", "off");
	    // If border: 0; -- iOS fails to open keyboard (issue #1287)
	    if (ios) te.style.border = "1px solid black";
	    disableBrowserMagic(te);
	    return div;
	  }

	  TextareaInput.prototype = copyObj({
	    init: function(display) {
	      var input = this, cm = this.cm;

	      // Wraps and hides input textarea
	      var div = this.wrapper = hiddenTextarea();
	      // The semihidden textarea that is focused when the editor is
	      // focused, and receives input.
	      var te = this.textarea = div.firstChild;
	      display.wrapper.insertBefore(div, display.wrapper.firstChild);

	      // Needed to hide big blue blinking cursor on Mobile Safari (doesn't seem to work in iOS 8 anymore)
	      if (ios) te.style.width = "0px";

	      on(te, "input", function() {
	        if (ie && ie_version >= 9 && input.hasSelection) input.hasSelection = null;
	        input.poll();
	      });

	      on(te, "paste", function(e) {
	        if (signalDOMEvent(cm, e) || handlePaste(e, cm)) return

	        cm.state.pasteIncoming = true;
	        input.fastPoll();
	      });

	      function prepareCopyCut(e) {
	        if (signalDOMEvent(cm, e)) return
	        if (cm.somethingSelected()) {
	          lastCopied = {lineWise: false, text: cm.getSelections()};
	          if (input.inaccurateSelection) {
	            input.prevInput = "";
	            input.inaccurateSelection = false;
	            te.value = lastCopied.text.join("\n");
	            selectInput(te);
	          }
	        } else if (!cm.options.lineWiseCopyCut) {
	          return;
	        } else {
	          var ranges = copyableRanges(cm);
	          lastCopied = {lineWise: true, text: ranges.text};
	          if (e.type == "cut") {
	            cm.setSelections(ranges.ranges, null, sel_dontScroll);
	          } else {
	            input.prevInput = "";
	            te.value = ranges.text.join("\n");
	            selectInput(te);
	          }
	        }
	        if (e.type == "cut") cm.state.cutIncoming = true;
	      }
	      on(te, "cut", prepareCopyCut);
	      on(te, "copy", prepareCopyCut);

	      on(display.scroller, "paste", function(e) {
	        if (eventInWidget(display, e) || signalDOMEvent(cm, e)) return;
	        cm.state.pasteIncoming = true;
	        input.focus();
	      });

	      // Prevent normal selection in the editor (we handle our own)
	      on(display.lineSpace, "selectstart", function(e) {
	        if (!eventInWidget(display, e)) e_preventDefault(e);
	      });

	      on(te, "compositionstart", function() {
	        var start = cm.getCursor("from");
	        if (input.composing) input.composing.range.clear()
	        input.composing = {
	          start: start,
	          range: cm.markText(start, cm.getCursor("to"), {className: "CodeMirror-composing"})
	        };
	      });
	      on(te, "compositionend", function() {
	        if (input.composing) {
	          input.poll();
	          input.composing.range.clear();
	          input.composing = null;
	        }
	      });
	    },

	    prepareSelection: function() {
	      // Redraw the selection and/or cursor
	      var cm = this.cm, display = cm.display, doc = cm.doc;
	      var result = prepareSelection(cm);

	      // Move the hidden textarea near the cursor to prevent scrolling artifacts
	      if (cm.options.moveInputWithCursor) {
	        var headPos = cursorCoords(cm, doc.sel.primary().head, "div");
	        var wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
	        result.teTop = Math.max(0, Math.min(display.wrapper.clientHeight - 10,
	                                            headPos.top + lineOff.top - wrapOff.top));
	        result.teLeft = Math.max(0, Math.min(display.wrapper.clientWidth - 10,
	                                             headPos.left + lineOff.left - wrapOff.left));
	      }

	      return result;
	    },

	    showSelection: function(drawn) {
	      var cm = this.cm, display = cm.display;
	      removeChildrenAndAdd(display.cursorDiv, drawn.cursors);
	      removeChildrenAndAdd(display.selectionDiv, drawn.selection);
	      if (drawn.teTop != null) {
	        this.wrapper.style.top = drawn.teTop + "px";
	        this.wrapper.style.left = drawn.teLeft + "px";
	      }
	    },

	    // Reset the input to correspond to the selection (or to be empty,
	    // when not typing and nothing is selected)
	    reset: function(typing) {
	      if (this.contextMenuPending) return;
	      var minimal, selected, cm = this.cm, doc = cm.doc;
	      if (cm.somethingSelected()) {
	        this.prevInput = "";
	        var range = doc.sel.primary();
	        minimal = hasCopyEvent &&
	          (range.to().line - range.from().line > 100 || (selected = cm.getSelection()).length > 1000);
	        var content = minimal ? "-" : selected || cm.getSelection();
	        this.textarea.value = content;
	        if (cm.state.focused) selectInput(this.textarea);
	        if (ie && ie_version >= 9) this.hasSelection = content;
	      } else if (!typing) {
	        this.prevInput = this.textarea.value = "";
	        if (ie && ie_version >= 9) this.hasSelection = null;
	      }
	      this.inaccurateSelection = minimal;
	    },

	    getField: function() { return this.textarea; },

	    supportsTouch: function() { return false; },

	    focus: function() {
	      if (this.cm.options.readOnly != "nocursor" && (!mobile || activeElt() != this.textarea)) {
	        try { this.textarea.focus(); }
	        catch (e) {} // IE8 will throw if the textarea is display: none or not in DOM
	      }
	    },

	    blur: function() { this.textarea.blur(); },

	    resetPosition: function() {
	      this.wrapper.style.top = this.wrapper.style.left = 0;
	    },

	    receivedFocus: function() { this.slowPoll(); },

	    // Poll for input changes, using the normal rate of polling. This
	    // runs as long as the editor is focused.
	    slowPoll: function() {
	      var input = this;
	      if (input.pollingFast) return;
	      input.polling.set(this.cm.options.pollInterval, function() {
	        input.poll();
	        if (input.cm.state.focused) input.slowPoll();
	      });
	    },

	    // When an event has just come in that is likely to add or change
	    // something in the input textarea, we poll faster, to ensure that
	    // the change appears on the screen quickly.
	    fastPoll: function() {
	      var missed = false, input = this;
	      input.pollingFast = true;
	      function p() {
	        var changed = input.poll();
	        if (!changed && !missed) {missed = true; input.polling.set(60, p);}
	        else {input.pollingFast = false; input.slowPoll();}
	      }
	      input.polling.set(20, p);
	    },

	    // Read input from the textarea, and update the document to match.
	    // When something is selected, it is present in the textarea, and
	    // selected (unless it is huge, in which case a placeholder is
	    // used). When nothing is selected, the cursor sits after previously
	    // seen text (can be empty), which is stored in prevInput (we must
	    // not reset the textarea when typing, because that breaks IME).
	    poll: function() {
	      var cm = this.cm, input = this.textarea, prevInput = this.prevInput;
	      // Since this is called a *lot*, try to bail out as cheaply as
	      // possible when it is clear that nothing happened. hasSelection
	      // will be the case when there is a lot of text in the textarea,
	      // in which case reading its value would be expensive.
	      if (this.contextMenuPending || !cm.state.focused ||
	          (hasSelection(input) && !prevInput && !this.composing) ||
	          cm.isReadOnly() || cm.options.disableInput || cm.state.keySeq)
	        return false;

	      var text = input.value;
	      // If nothing changed, bail.
	      if (text == prevInput && !cm.somethingSelected()) return false;
	      // Work around nonsensical selection resetting in IE9/10, and
	      // inexplicable appearance of private area unicode characters on
	      // some key combos in Mac (#2689).
	      if (ie && ie_version >= 9 && this.hasSelection === text ||
	          mac && /[\uf700-\uf7ff]/.test(text)) {
	        cm.display.input.reset();
	        return false;
	      }

	      if (cm.doc.sel == cm.display.selForContextMenu) {
	        var first = text.charCodeAt(0);
	        if (first == 0x200b && !prevInput) prevInput = "\u200b";
	        if (first == 0x21da) { this.reset(); return this.cm.execCommand("undo"); }
	      }
	      // Find the part of the input that is actually new
	      var same = 0, l = Math.min(prevInput.length, text.length);
	      while (same < l && prevInput.charCodeAt(same) == text.charCodeAt(same)) ++same;

	      var self = this;
	      runInOp(cm, function() {
	        applyTextInput(cm, text.slice(same), prevInput.length - same,
	                       null, self.composing ? "*compose" : null);

	        // Don't leave long text in the textarea, since it makes further polling slow
	        if (text.length > 1000 || text.indexOf("\n") > -1) input.value = self.prevInput = "";
	        else self.prevInput = text;

	        if (self.composing) {
	          self.composing.range.clear();
	          self.composing.range = cm.markText(self.composing.start, cm.getCursor("to"),
	                                             {className: "CodeMirror-composing"});
	        }
	      });
	      return true;
	    },

	    ensurePolled: function() {
	      if (this.pollingFast && this.poll()) this.pollingFast = false;
	    },

	    onKeyPress: function() {
	      if (ie && ie_version >= 9) this.hasSelection = null;
	      this.fastPoll();
	    },

	    onContextMenu: function(e) {
	      var input = this, cm = input.cm, display = cm.display, te = input.textarea;
	      var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
	      if (!pos || presto) return; // Opera is difficult.

	      // Reset the current text selection only if the click is done outside of the selection
	      // and 'resetSelectionOnContextMenu' option is true.
	      var reset = cm.options.resetSelectionOnContextMenu;
	      if (reset && cm.doc.sel.contains(pos) == -1)
	        operation(cm, setSelection)(cm.doc, simpleSelection(pos), sel_dontScroll);

	      var oldCSS = te.style.cssText, oldWrapperCSS = input.wrapper.style.cssText;
	      input.wrapper.style.cssText = "position: absolute"
	      var wrapperBox = input.wrapper.getBoundingClientRect()
	      te.style.cssText = "position: absolute; width: 30px; height: 30px; top: " + (e.clientY - wrapperBox.top - 5) +
	        "px; left: " + (e.clientX - wrapperBox.left - 5) + "px; z-index: 1000; background: " +
	        (ie ? "rgba(255, 255, 255, .05)" : "transparent") +
	        "; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
	      if (webkit) var oldScrollY = window.scrollY; // Work around Chrome issue (#2712)
	      display.input.focus();
	      if (webkit) window.scrollTo(null, oldScrollY);
	      display.input.reset();
	      // Adds "Select all" to context menu in FF
	      if (!cm.somethingSelected()) te.value = input.prevInput = " ";
	      input.contextMenuPending = true;
	      display.selForContextMenu = cm.doc.sel;
	      clearTimeout(display.detectingSelectAll);

	      // Select-all will be greyed out if there's nothing to select, so
	      // this adds a zero-width space so that we can later check whether
	      // it got selected.
	      function prepareSelectAllHack() {
	        if (te.selectionStart != null) {
	          var selected = cm.somethingSelected();
	          var extval = "\u200b" + (selected ? te.value : "");
	          te.value = "\u21da"; // Used to catch context-menu undo
	          te.value = extval;
	          input.prevInput = selected ? "" : "\u200b";
	          te.selectionStart = 1; te.selectionEnd = extval.length;
	          // Re-set this, in case some other handler touched the
	          // selection in the meantime.
	          display.selForContextMenu = cm.doc.sel;
	        }
	      }
	      function rehide() {
	        input.contextMenuPending = false;
	        input.wrapper.style.cssText = oldWrapperCSS
	        te.style.cssText = oldCSS;
	        if (ie && ie_version < 9) display.scrollbars.setScrollTop(display.scroller.scrollTop = scrollPos);

	        // Try to detect the user choosing select-all
	        if (te.selectionStart != null) {
	          if (!ie || (ie && ie_version < 9)) prepareSelectAllHack();
	          var i = 0, poll = function() {
	            if (display.selForContextMenu == cm.doc.sel && te.selectionStart == 0 &&
	                te.selectionEnd > 0 && input.prevInput == "\u200b")
	              operation(cm, commands.selectAll)(cm);
	            else if (i++ < 10) display.detectingSelectAll = setTimeout(poll, 500);
	            else display.input.reset();
	          };
	          display.detectingSelectAll = setTimeout(poll, 200);
	        }
	      }

	      if (ie && ie_version >= 9) prepareSelectAllHack();
	      if (captureRightClick) {
	        e_stop(e);
	        var mouseup = function() {
	          off(window, "mouseup", mouseup);
	          setTimeout(rehide, 20);
	        };
	        on(window, "mouseup", mouseup);
	      } else {
	        setTimeout(rehide, 50);
	      }
	    },

	    readOnlyChanged: function(val) {
	      if (!val) this.reset();
	    },

	    setUneditable: nothing,

	    needsContentAttribute: false
	  }, TextareaInput.prototype);

	  // CONTENTEDITABLE INPUT STYLE

	  function ContentEditableInput(cm) {
	    this.cm = cm;
	    this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
	    this.polling = new Delayed();
	    this.gracePeriod = false;
	  }

	  ContentEditableInput.prototype = copyObj({
	    init: function(display) {
	      var input = this, cm = input.cm;
	      var div = input.div = display.lineDiv;
	      disableBrowserMagic(div, cm.options.spellcheck);

	      on(div, "paste", function(e) {
	        if (signalDOMEvent(cm, e) || handlePaste(e, cm)) return
	        // IE doesn't fire input events, so we schedule a read for the pasted content in this way
	        if (ie_version <= 11) setTimeout(operation(cm, function() {
	          if (!input.pollContent()) regChange(cm);
	        }), 20)
	      })

	      on(div, "compositionstart", function(e) {
	        var data = e.data;
	        input.composing = {sel: cm.doc.sel, data: data, startData: data};
	        if (!data) return;
	        var prim = cm.doc.sel.primary();
	        var line = cm.getLine(prim.head.line);
	        var found = line.indexOf(data, Math.max(0, prim.head.ch - data.length));
	        if (found > -1 && found <= prim.head.ch)
	          input.composing.sel = simpleSelection(Pos(prim.head.line, found),
	                                                Pos(prim.head.line, found + data.length));
	      });
	      on(div, "compositionupdate", function(e) {
	        input.composing.data = e.data;
	      });
	      on(div, "compositionend", function(e) {
	        var ours = input.composing;
	        if (!ours) return;
	        if (e.data != ours.startData && !/\u200b/.test(e.data))
	          ours.data = e.data;
	        // Need a small delay to prevent other code (input event,
	        // selection polling) from doing damage when fired right after
	        // compositionend.
	        setTimeout(function() {
	          if (!ours.handled)
	            input.applyComposition(ours);
	          if (input.composing == ours)
	            input.composing = null;
	        }, 50);
	      });

	      on(div, "touchstart", function() {
	        input.forceCompositionEnd();
	      });

	      on(div, "input", function() {
	        if (input.composing) return;
	        if (cm.isReadOnly() || !input.pollContent())
	          runInOp(input.cm, function() {regChange(cm);});
	      });

	      function onCopyCut(e) {
	        if (signalDOMEvent(cm, e)) return
	        if (cm.somethingSelected()) {
	          lastCopied = {lineWise: false, text: cm.getSelections()};
	          if (e.type == "cut") cm.replaceSelection("", null, "cut");
	        } else if (!cm.options.lineWiseCopyCut) {
	          return;
	        } else {
	          var ranges = copyableRanges(cm);
	          lastCopied = {lineWise: true, text: ranges.text};
	          if (e.type == "cut") {
	            cm.operation(function() {
	              cm.setSelections(ranges.ranges, 0, sel_dontScroll);
	              cm.replaceSelection("", null, "cut");
	            });
	          }
	        }
	        if (e.clipboardData) {
	          e.clipboardData.clearData();
	          var content = lastCopied.text.join("\n")
	          // iOS exposes the clipboard API, but seems to discard content inserted into it
	          e.clipboardData.setData("Text", content);
	          if (e.clipboardData.getData("Text") == content) {
	            e.preventDefault();
	            return
	          }
	        }
	        // Old-fashioned briefly-focus-a-textarea hack
	        var kludge = hiddenTextarea(), te = kludge.firstChild;
	        cm.display.lineSpace.insertBefore(kludge, cm.display.lineSpace.firstChild);
	        te.value = lastCopied.text.join("\n");
	        var hadFocus = document.activeElement;
	        selectInput(te);
	        setTimeout(function() {
	          cm.display.lineSpace.removeChild(kludge);
	          hadFocus.focus();
	          if (hadFocus == div) input.showPrimarySelection()
	        }, 50);
	      }
	      on(div, "copy", onCopyCut);
	      on(div, "cut", onCopyCut);
	    },

	    prepareSelection: function() {
	      var result = prepareSelection(this.cm, false);
	      result.focus = this.cm.state.focused;
	      return result;
	    },

	    showSelection: function(info, takeFocus) {
	      if (!info || !this.cm.display.view.length) return;
	      if (info.focus || takeFocus) this.showPrimarySelection();
	      this.showMultipleSelections(info);
	    },

	    showPrimarySelection: function() {
	      var sel = window.getSelection(), prim = this.cm.doc.sel.primary();
	      var curAnchor = domToPos(this.cm, sel.anchorNode, sel.anchorOffset);
	      var curFocus = domToPos(this.cm, sel.focusNode, sel.focusOffset);
	      if (curAnchor && !curAnchor.bad && curFocus && !curFocus.bad &&
	          cmp(minPos(curAnchor, curFocus), prim.from()) == 0 &&
	          cmp(maxPos(curAnchor, curFocus), prim.to()) == 0)
	        return;

	      var start = posToDOM(this.cm, prim.from());
	      var end = posToDOM(this.cm, prim.to());
	      if (!start && !end) return;

	      var view = this.cm.display.view;
	      var old = sel.rangeCount && sel.getRangeAt(0);
	      if (!start) {
	        start = {node: view[0].measure.map[2], offset: 0};
	      } else if (!end) { // FIXME dangerously hacky
	        var measure = view[view.length - 1].measure;
	        var map = measure.maps ? measure.maps[measure.maps.length - 1] : measure.map;
	        end = {node: map[map.length - 1], offset: map[map.length - 2] - map[map.length - 3]};
	      }

	      try { var rng = range(start.node, start.offset, end.offset, end.node); }
	      catch(e) {} // Our model of the DOM might be outdated, in which case the range we try to set can be impossible
	      if (rng) {
	        if (!gecko && this.cm.state.focused) {
	          sel.collapse(start.node, start.offset);
	          if (!rng.collapsed) sel.addRange(rng);
	        } else {
	          sel.removeAllRanges();
	          sel.addRange(rng);
	        }
	        if (old && sel.anchorNode == null) sel.addRange(old);
	        else if (gecko) this.startGracePeriod();
	      }
	      this.rememberSelection();
	    },

	    startGracePeriod: function() {
	      var input = this;
	      clearTimeout(this.gracePeriod);
	      this.gracePeriod = setTimeout(function() {
	        input.gracePeriod = false;
	        if (input.selectionChanged())
	          input.cm.operation(function() { input.cm.curOp.selectionChanged = true; });
	      }, 20);
	    },

	    showMultipleSelections: function(info) {
	      removeChildrenAndAdd(this.cm.display.cursorDiv, info.cursors);
	      removeChildrenAndAdd(this.cm.display.selectionDiv, info.selection);
	    },

	    rememberSelection: function() {
	      var sel = window.getSelection();
	      this.lastAnchorNode = sel.anchorNode; this.lastAnchorOffset = sel.anchorOffset;
	      this.lastFocusNode = sel.focusNode; this.lastFocusOffset = sel.focusOffset;
	    },

	    selectionInEditor: function() {
	      var sel = window.getSelection();
	      if (!sel.rangeCount) return false;
	      var node = sel.getRangeAt(0).commonAncestorContainer;
	      return contains(this.div, node);
	    },

	    focus: function() {
	      if (this.cm.options.readOnly != "nocursor") this.div.focus();
	    },
	    blur: function() { this.div.blur(); },
	    getField: function() { return this.div; },

	    supportsTouch: function() { return true; },

	    receivedFocus: function() {
	      var input = this;
	      if (this.selectionInEditor())
	        this.pollSelection();
	      else
	        runInOp(this.cm, function() { input.cm.curOp.selectionChanged = true; });

	      function poll() {
	        if (input.cm.state.focused) {
	          input.pollSelection();
	          input.polling.set(input.cm.options.pollInterval, poll);
	        }
	      }
	      this.polling.set(this.cm.options.pollInterval, poll);
	    },

	    selectionChanged: function() {
	      var sel = window.getSelection();
	      return sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset ||
	        sel.focusNode != this.lastFocusNode || sel.focusOffset != this.lastFocusOffset;
	    },

	    pollSelection: function() {
	      if (!this.composing && !this.gracePeriod && this.selectionChanged()) {
	        var sel = window.getSelection(), cm = this.cm;
	        this.rememberSelection();
	        var anchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
	        var head = domToPos(cm, sel.focusNode, sel.focusOffset);
	        if (anchor && head) runInOp(cm, function() {
	          setSelection(cm.doc, simpleSelection(anchor, head), sel_dontScroll);
	          if (anchor.bad || head.bad) cm.curOp.selectionChanged = true;
	        });
	      }
	    },

	    pollContent: function() {
	      var cm = this.cm, display = cm.display, sel = cm.doc.sel.primary();
	      var from = sel.from(), to = sel.to();
	      if (from.line < display.viewFrom || to.line > display.viewTo - 1) return false;

	      var fromIndex;
	      if (from.line == display.viewFrom || (fromIndex = findViewIndex(cm, from.line)) == 0) {
	        var fromLine = lineNo(display.view[0].line);
	        var fromNode = display.view[0].node;
	      } else {
	        var fromLine = lineNo(display.view[fromIndex].line);
	        var fromNode = display.view[fromIndex - 1].node.nextSibling;
	      }
	      var toIndex = findViewIndex(cm, to.line);
	      if (toIndex == display.view.length - 1) {
	        var toLine = display.viewTo - 1;
	        var toNode = display.lineDiv.lastChild;
	      } else {
	        var toLine = lineNo(display.view[toIndex + 1].line) - 1;
	        var toNode = display.view[toIndex + 1].node.previousSibling;
	      }

	      var newText = cm.doc.splitLines(domTextBetween(cm, fromNode, toNode, fromLine, toLine));
	      var oldText = getBetween(cm.doc, Pos(fromLine, 0), Pos(toLine, getLine(cm.doc, toLine).text.length));
	      while (newText.length > 1 && oldText.length > 1) {
	        if (lst(newText) == lst(oldText)) { newText.pop(); oldText.pop(); toLine--; }
	        else if (newText[0] == oldText[0]) { newText.shift(); oldText.shift(); fromLine++; }
	        else break;
	      }

	      var cutFront = 0, cutEnd = 0;
	      var newTop = newText[0], oldTop = oldText[0], maxCutFront = Math.min(newTop.length, oldTop.length);
	      while (cutFront < maxCutFront && newTop.charCodeAt(cutFront) == oldTop.charCodeAt(cutFront))
	        ++cutFront;
	      var newBot = lst(newText), oldBot = lst(oldText);
	      var maxCutEnd = Math.min(newBot.length - (newText.length == 1 ? cutFront : 0),
	                               oldBot.length - (oldText.length == 1 ? cutFront : 0));
	      while (cutEnd < maxCutEnd &&
	             newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1))
	        ++cutEnd;

	      newText[newText.length - 1] = newBot.slice(0, newBot.length - cutEnd);
	      newText[0] = newText[0].slice(cutFront);

	      var chFrom = Pos(fromLine, cutFront);
	      var chTo = Pos(toLine, oldText.length ? lst(oldText).length - cutEnd : 0);
	      if (newText.length > 1 || newText[0] || cmp(chFrom, chTo)) {
	        replaceRange(cm.doc, newText, chFrom, chTo, "+input");
	        return true;
	      }
	    },

	    ensurePolled: function() {
	      this.forceCompositionEnd();
	    },
	    reset: function() {
	      this.forceCompositionEnd();
	    },
	    forceCompositionEnd: function() {
	      if (!this.composing || this.composing.handled) return;
	      this.applyComposition(this.composing);
	      this.composing.handled = true;
	      this.div.blur();
	      this.div.focus();
	    },
	    applyComposition: function(composing) {
	      if (this.cm.isReadOnly())
	        operation(this.cm, regChange)(this.cm)
	      else if (composing.data && composing.data != composing.startData)
	        operation(this.cm, applyTextInput)(this.cm, composing.data, 0, composing.sel);
	    },

	    setUneditable: function(node) {
	      node.contentEditable = "false"
	    },

	    onKeyPress: function(e) {
	      e.preventDefault();
	      if (!this.cm.isReadOnly())
	        operation(this.cm, applyTextInput)(this.cm, String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode), 0);
	    },

	    readOnlyChanged: function(val) {
	      this.div.contentEditable = String(val != "nocursor")
	    },

	    onContextMenu: nothing,
	    resetPosition: nothing,

	    needsContentAttribute: true
	  }, ContentEditableInput.prototype);

	  function posToDOM(cm, pos) {
	    var view = findViewForLine(cm, pos.line);
	    if (!view || view.hidden) return null;
	    var line = getLine(cm.doc, pos.line);
	    var info = mapFromLineView(view, line, pos.line);

	    var order = getOrder(line), side = "left";
	    if (order) {
	      var partPos = getBidiPartAt(order, pos.ch);
	      side = partPos % 2 ? "right" : "left";
	    }
	    var result = nodeAndOffsetInLineMap(info.map, pos.ch, side);
	    result.offset = result.collapse == "right" ? result.end : result.start;
	    return result;
	  }

	  function badPos(pos, bad) { if (bad) pos.bad = true; return pos; }

	  function domToPos(cm, node, offset) {
	    var lineNode;
	    if (node == cm.display.lineDiv) {
	      lineNode = cm.display.lineDiv.childNodes[offset];
	      if (!lineNode) return badPos(cm.clipPos(Pos(cm.display.viewTo - 1)), true);
	      node = null; offset = 0;
	    } else {
	      for (lineNode = node;; lineNode = lineNode.parentNode) {
	        if (!lineNode || lineNode == cm.display.lineDiv) return null;
	        if (lineNode.parentNode && lineNode.parentNode == cm.display.lineDiv) break;
	      }
	    }
	    for (var i = 0; i < cm.display.view.length; i++) {
	      var lineView = cm.display.view[i];
	      if (lineView.node == lineNode)
	        return locateNodeInLineView(lineView, node, offset);
	    }
	  }

	  function locateNodeInLineView(lineView, node, offset) {
	    var wrapper = lineView.text.firstChild, bad = false;
	    if (!node || !contains(wrapper, node)) return badPos(Pos(lineNo(lineView.line), 0), true);
	    if (node == wrapper) {
	      bad = true;
	      node = wrapper.childNodes[offset];
	      offset = 0;
	      if (!node) {
	        var line = lineView.rest ? lst(lineView.rest) : lineView.line;
	        return badPos(Pos(lineNo(line), line.text.length), bad);
	      }
	    }

	    var textNode = node.nodeType == 3 ? node : null, topNode = node;
	    if (!textNode && node.childNodes.length == 1 && node.firstChild.nodeType == 3) {
	      textNode = node.firstChild;
	      if (offset) offset = textNode.nodeValue.length;
	    }
	    while (topNode.parentNode != wrapper) topNode = topNode.parentNode;
	    var measure = lineView.measure, maps = measure.maps;

	    function find(textNode, topNode, offset) {
	      for (var i = -1; i < (maps ? maps.length : 0); i++) {
	        var map = i < 0 ? measure.map : maps[i];
	        for (var j = 0; j < map.length; j += 3) {
	          var curNode = map[j + 2];
	          if (curNode == textNode || curNode == topNode) {
	            var line = lineNo(i < 0 ? lineView.line : lineView.rest[i]);
	            var ch = map[j] + offset;
	            if (offset < 0 || curNode != textNode) ch = map[j + (offset ? 1 : 0)];
	            return Pos(line, ch);
	          }
	        }
	      }
	    }
	    var found = find(textNode, topNode, offset);
	    if (found) return badPos(found, bad);

	    // FIXME this is all really shaky. might handle the few cases it needs to handle, but likely to cause problems
	    for (var after = topNode.nextSibling, dist = textNode ? textNode.nodeValue.length - offset : 0; after; after = after.nextSibling) {
	      found = find(after, after.firstChild, 0);
	      if (found)
	        return badPos(Pos(found.line, found.ch - dist), bad);
	      else
	        dist += after.textContent.length;
	    }
	    for (var before = topNode.previousSibling, dist = offset; before; before = before.previousSibling) {
	      found = find(before, before.firstChild, -1);
	      if (found)
	        return badPos(Pos(found.line, found.ch + dist), bad);
	      else
	        dist += before.textContent.length;
	    }
	  }

	  function domTextBetween(cm, from, to, fromLine, toLine) {
	    var text = "", closing = false, lineSep = cm.doc.lineSeparator();
	    function recognizeMarker(id) { return function(marker) { return marker.id == id; }; }
	    function walk(node) {
	      if (node.nodeType == 1) {
	        var cmText = node.getAttribute("cm-text");
	        if (cmText != null) {
	          if (cmText == "") cmText = node.textContent.replace(/\u200b/g, "");
	          text += cmText;
	          return;
	        }
	        var markerID = node.getAttribute("cm-marker"), range;
	        if (markerID) {
	          var found = cm.findMarks(Pos(fromLine, 0), Pos(toLine + 1, 0), recognizeMarker(+markerID));
	          if (found.length && (range = found[0].find()))
	            text += getBetween(cm.doc, range.from, range.to).join(lineSep);
	          return;
	        }
	        if (node.getAttribute("contenteditable") == "false") return;
	        for (var i = 0; i < node.childNodes.length; i++)
	          walk(node.childNodes[i]);
	        if (/^(pre|div|p)$/i.test(node.nodeName))
	          closing = true;
	      } else if (node.nodeType == 3) {
	        var val = node.nodeValue;
	        if (!val) return;
	        if (closing) {
	          text += lineSep;
	          closing = false;
	        }
	        text += val;
	      }
	    }
	    for (;;) {
	      walk(from);
	      if (from == to) break;
	      from = from.nextSibling;
	    }
	    return text;
	  }

	  CodeMirror.inputStyles = {"textarea": TextareaInput, "contenteditable": ContentEditableInput};

	  // SELECTION / CURSOR

	  // Selection objects are immutable. A new one is created every time
	  // the selection changes. A selection is one or more non-overlapping
	  // (and non-touching) ranges, sorted, and an integer that indicates
	  // which one is the primary selection (the one that's scrolled into
	  // view, that getCursor returns, etc).
	  function Selection(ranges, primIndex) {
	    this.ranges = ranges;
	    this.primIndex = primIndex;
	  }

	  Selection.prototype = {
	    primary: function() { return this.ranges[this.primIndex]; },
	    equals: function(other) {
	      if (other == this) return true;
	      if (other.primIndex != this.primIndex || other.ranges.length != this.ranges.length) return false;
	      for (var i = 0; i < this.ranges.length; i++) {
	        var here = this.ranges[i], there = other.ranges[i];
	        if (cmp(here.anchor, there.anchor) != 0 || cmp(here.head, there.head) != 0) return false;
	      }
	      return true;
	    },
	    deepCopy: function() {
	      for (var out = [], i = 0; i < this.ranges.length; i++)
	        out[i] = new Range(copyPos(this.ranges[i].anchor), copyPos(this.ranges[i].head));
	      return new Selection(out, this.primIndex);
	    },
	    somethingSelected: function() {
	      for (var i = 0; i < this.ranges.length; i++)
	        if (!this.ranges[i].empty()) return true;
	      return false;
	    },
	    contains: function(pos, end) {
	      if (!end) end = pos;
	      for (var i = 0; i < this.ranges.length; i++) {
	        var range = this.ranges[i];
	        if (cmp(end, range.from()) >= 0 && cmp(pos, range.to()) <= 0)
	          return i;
	      }
	      return -1;
	    }
	  };

	  function Range(anchor, head) {
	    this.anchor = anchor; this.head = head;
	  }

	  Range.prototype = {
	    from: function() { return minPos(this.anchor, this.head); },
	    to: function() { return maxPos(this.anchor, this.head); },
	    empty: function() {
	      return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
	    }
	  };

	  // Take an unsorted, potentially overlapping set of ranges, and
	  // build a selection out of it. 'Consumes' ranges array (modifying
	  // it).
	  function normalizeSelection(ranges, primIndex) {
	    var prim = ranges[primIndex];
	    ranges.sort(function(a, b) { return cmp(a.from(), b.from()); });
	    primIndex = indexOf(ranges, prim);
	    for (var i = 1; i < ranges.length; i++) {
	      var cur = ranges[i], prev = ranges[i - 1];
	      if (cmp(prev.to(), cur.from()) >= 0) {
	        var from = minPos(prev.from(), cur.from()), to = maxPos(prev.to(), cur.to());
	        var inv = prev.empty() ? cur.from() == cur.head : prev.from() == prev.head;
	        if (i <= primIndex) --primIndex;
	        ranges.splice(--i, 2, new Range(inv ? to : from, inv ? from : to));
	      }
	    }
	    return new Selection(ranges, primIndex);
	  }

	  function simpleSelection(anchor, head) {
	    return new Selection([new Range(anchor, head || anchor)], 0);
	  }

	  // Most of the external API clips given positions to make sure they
	  // actually exist within the document.
	  function clipLine(doc, n) {return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1));}
	  function clipPos(doc, pos) {
	    if (pos.line < doc.first) return Pos(doc.first, 0);
	    var last = doc.first + doc.size - 1;
	    if (pos.line > last) return Pos(last, getLine(doc, last).text.length);
	    return clipToLen(pos, getLine(doc, pos.line).text.length);
	  }
	  function clipToLen(pos, linelen) {
	    var ch = pos.ch;
	    if (ch == null || ch > linelen) return Pos(pos.line, linelen);
	    else if (ch < 0) return Pos(pos.line, 0);
	    else return pos;
	  }
	  function isLine(doc, l) {return l >= doc.first && l < doc.first + doc.size;}
	  function clipPosArray(doc, array) {
	    for (var out = [], i = 0; i < array.length; i++) out[i] = clipPos(doc, array[i]);
	    return out;
	  }

	  // SELECTION UPDATES

	  // The 'scroll' parameter given to many of these indicated whether
	  // the new cursor position should be scrolled into view after
	  // modifying the selection.

	  // If shift is held or the extend flag is set, extends a range to
	  // include a given position (and optionally a second position).
	  // Otherwise, simply returns the range between the given positions.
	  // Used for cursor motion and such.
	  function extendRange(doc, range, head, other) {
	    if (doc.cm && doc.cm.display.shift || doc.extend) {
	      var anchor = range.anchor;
	      if (other) {
	        var posBefore = cmp(head, anchor) < 0;
	        if (posBefore != (cmp(other, anchor) < 0)) {
	          anchor = head;
	          head = other;
	        } else if (posBefore != (cmp(head, other) < 0)) {
	          head = other;
	        }
	      }
	      return new Range(anchor, head);
	    } else {
	      return new Range(other || head, head);
	    }
	  }

	  // Extend the primary selection range, discard the rest.
	  function extendSelection(doc, head, other, options) {
	    setSelection(doc, new Selection([extendRange(doc, doc.sel.primary(), head, other)], 0), options);
	  }

	  // Extend all selections (pos is an array of selections with length
	  // equal the number of selections)
	  function extendSelections(doc, heads, options) {
	    for (var out = [], i = 0; i < doc.sel.ranges.length; i++)
	      out[i] = extendRange(doc, doc.sel.ranges[i], heads[i], null);
	    var newSel = normalizeSelection(out, doc.sel.primIndex);
	    setSelection(doc, newSel, options);
	  }

	  // Updates a single range in the selection.
	  function replaceOneSelection(doc, i, range, options) {
	    var ranges = doc.sel.ranges.slice(0);
	    ranges[i] = range;
	    setSelection(doc, normalizeSelection(ranges, doc.sel.primIndex), options);
	  }

	  // Reset the selection to a single range.
	  function setSimpleSelection(doc, anchor, head, options) {
	    setSelection(doc, simpleSelection(anchor, head), options);
	  }

	  // Give beforeSelectionChange handlers a change to influence a
	  // selection update.
	  function filterSelectionChange(doc, sel, options) {
	    var obj = {
	      ranges: sel.ranges,
	      update: function(ranges) {
	        this.ranges = [];
	        for (var i = 0; i < ranges.length; i++)
	          this.ranges[i] = new Range(clipPos(doc, ranges[i].anchor),
	                                     clipPos(doc, ranges[i].head));
	      },
	      origin: options && options.origin
	    };
	    signal(doc, "beforeSelectionChange", doc, obj);
	    if (doc.cm) signal(doc.cm, "beforeSelectionChange", doc.cm, obj);
	    if (obj.ranges != sel.ranges) return normalizeSelection(obj.ranges, obj.ranges.length - 1);
	    else return sel;
	  }

	  function setSelectionReplaceHistory(doc, sel, options) {
	    var done = doc.history.done, last = lst(done);
	    if (last && last.ranges) {
	      done[done.length - 1] = sel;
	      setSelectionNoUndo(doc, sel, options);
	    } else {
	      setSelection(doc, sel, options);
	    }
	  }

	  // Set a new selection.
	  function setSelection(doc, sel, options) {
	    setSelectionNoUndo(doc, sel, options);
	    addSelectionToHistory(doc, doc.sel, doc.cm ? doc.cm.curOp.id : NaN, options);
	  }

	  function setSelectionNoUndo(doc, sel, options) {
	    if (hasHandler(doc, "beforeSelectionChange") || doc.cm && hasHandler(doc.cm, "beforeSelectionChange"))
	      sel = filterSelectionChange(doc, sel, options);

	    var bias = options && options.bias ||
	      (cmp(sel.primary().head, doc.sel.primary().head) < 0 ? -1 : 1);
	    setSelectionInner(doc, skipAtomicInSelection(doc, sel, bias, true));

	    if (!(options && options.scroll === false) && doc.cm)
	      ensureCursorVisible(doc.cm);
	  }

	  function setSelectionInner(doc, sel) {
	    if (sel.equals(doc.sel)) return;

	    doc.sel = sel;

	    if (doc.cm) {
	      doc.cm.curOp.updateInput = doc.cm.curOp.selectionChanged = true;
	      signalCursorActivity(doc.cm);
	    }
	    signalLater(doc, "cursorActivity", doc);
	  }

	  // Verify that the selection does not partially select any atomic
	  // marked ranges.
	  function reCheckSelection(doc) {
	    setSelectionInner(doc, skipAtomicInSelection(doc, doc.sel, null, false), sel_dontScroll);
	  }

	  // Return a selection that does not partially select any atomic
	  // ranges.
	  function skipAtomicInSelection(doc, sel, bias, mayClear) {
	    var out;
	    for (var i = 0; i < sel.ranges.length; i++) {
	      var range = sel.ranges[i];
	      var old = sel.ranges.length == doc.sel.ranges.length && doc.sel.ranges[i];
	      var newAnchor = skipAtomic(doc, range.anchor, old && old.anchor, bias, mayClear);
	      var newHead = skipAtomic(doc, range.head, old && old.head, bias, mayClear);
	      if (out || newAnchor != range.anchor || newHead != range.head) {
	        if (!out) out = sel.ranges.slice(0, i);
	        out[i] = new Range(newAnchor, newHead);
	      }
	    }
	    return out ? normalizeSelection(out, sel.primIndex) : sel;
	  }

	  function skipAtomicInner(doc, pos, oldPos, dir, mayClear) {
	    var line = getLine(doc, pos.line);
	    if (line.markedSpans) for (var i = 0; i < line.markedSpans.length; ++i) {
	      var sp = line.markedSpans[i], m = sp.marker;
	      if ((sp.from == null || (m.inclusiveLeft ? sp.from <= pos.ch : sp.from < pos.ch)) &&
	          (sp.to == null || (m.inclusiveRight ? sp.to >= pos.ch : sp.to > pos.ch))) {
	        if (mayClear) {
	          signal(m, "beforeCursorEnter");
	          if (m.explicitlyCleared) {
	            if (!line.markedSpans) break;
	            else {--i; continue;}
	          }
	        }
	        if (!m.atomic) continue;

	        if (oldPos) {
	          var near = m.find(dir < 0 ? 1 : -1), diff;
	          if (dir < 0 ? m.inclusiveRight : m.inclusiveLeft)
	            near = movePos(doc, near, -dir, near && near.line == pos.line ? line : null);
	          if (near && near.line == pos.line && (diff = cmp(near, oldPos)) && (dir < 0 ? diff < 0 : diff > 0))
	            return skipAtomicInner(doc, near, pos, dir, mayClear);
	        }

	        var far = m.find(dir < 0 ? -1 : 1);
	        if (dir < 0 ? m.inclusiveLeft : m.inclusiveRight)
	          far = movePos(doc, far, dir, far.line == pos.line ? line : null);
	        return far ? skipAtomicInner(doc, far, pos, dir, mayClear) : null;
	      }
	    }
	    return pos;
	  }

	  // Ensure a given position is not inside an atomic range.
	  function skipAtomic(doc, pos, oldPos, bias, mayClear) {
	    var dir = bias || 1;
	    var found = skipAtomicInner(doc, pos, oldPos, dir, mayClear) ||
	        (!mayClear && skipAtomicInner(doc, pos, oldPos, dir, true)) ||
	        skipAtomicInner(doc, pos, oldPos, -dir, mayClear) ||
	        (!mayClear && skipAtomicInner(doc, pos, oldPos, -dir, true));
	    if (!found) {
	      doc.cantEdit = true;
	      return Pos(doc.first, 0);
	    }
	    return found;
	  }

	  function movePos(doc, pos, dir, line) {
	    if (dir < 0 && pos.ch == 0) {
	      if (pos.line > doc.first) return clipPos(doc, Pos(pos.line - 1));
	      else return null;
	    } else if (dir > 0 && pos.ch == (line || getLine(doc, pos.line)).text.length) {
	      if (pos.line < doc.first + doc.size - 1) return Pos(pos.line + 1, 0);
	      else return null;
	    } else {
	      return new Pos(pos.line, pos.ch + dir);
	    }
	  }

	  // SELECTION DRAWING

	  function updateSelection(cm) {
	    cm.display.input.showSelection(cm.display.input.prepareSelection());
	  }

	  function prepareSelection(cm, primary) {
	    var doc = cm.doc, result = {};
	    var curFragment = result.cursors = document.createDocumentFragment();
	    var selFragment = result.selection = document.createDocumentFragment();

	    for (var i = 0; i < doc.sel.ranges.length; i++) {
	      if (primary === false && i == doc.sel.primIndex) continue;
	      var range = doc.sel.ranges[i];
	      if (range.from().line >= cm.display.viewTo || range.to().line < cm.display.viewFrom) continue;
	      var collapsed = range.empty();
	      if (collapsed || cm.options.showCursorWhenSelecting)
	        drawSelectionCursor(cm, range.head, curFragment);
	      if (!collapsed)
	        drawSelectionRange(cm, range, selFragment);
	    }
	    return result;
	  }

	  // Draws a cursor for the given range
	  function drawSelectionCursor(cm, head, output) {
	    var pos = cursorCoords(cm, head, "div", null, null, !cm.options.singleCursorHeightPerLine);

	    var cursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor"));
	    cursor.style.left = pos.left + "px";
	    cursor.style.top = pos.top + "px";
	    cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px";

	    if (pos.other) {
	      // Secondary cursor, shown when on a 'jump' in bi-directional text
	      var otherCursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor"));
	      otherCursor.style.display = "";
	      otherCursor.style.left = pos.other.left + "px";
	      otherCursor.style.top = pos.other.top + "px";
	      otherCursor.style.height = (pos.other.bottom - pos.other.top) * .85 + "px";
	    }
	  }

	  // Draws the given range as a highlighted selection
	  function drawSelectionRange(cm, range, output) {
	    var display = cm.display, doc = cm.doc;
	    var fragment = document.createDocumentFragment();
	    var padding = paddingH(cm.display), leftSide = padding.left;
	    var rightSide = Math.max(display.sizerWidth, displayWidth(cm) - display.sizer.offsetLeft) - padding.right;

	    function add(left, top, width, bottom) {
	      if (top < 0) top = 0;
	      top = Math.round(top);
	      bottom = Math.round(bottom);
	      fragment.appendChild(elt("div", null, "CodeMirror-selected", "position: absolute; left: " + left +
	                               "px; top: " + top + "px; width: " + (width == null ? rightSide - left : width) +
	                               "px; height: " + (bottom - top) + "px"));
	    }

	    function drawForLine(line, fromArg, toArg) {
	      var lineObj = getLine(doc, line);
	      var lineLen = lineObj.text.length;
	      var start, end;
	      function coords(ch, bias) {
	        return charCoords(cm, Pos(line, ch), "div", lineObj, bias);
	      }

	      iterateBidiSections(getOrder(lineObj), fromArg || 0, toArg == null ? lineLen : toArg, function(from, to, dir) {
	        var leftPos = coords(from, "left"), rightPos, left, right;
	        if (from == to) {
	          rightPos = leftPos;
	          left = right = leftPos.left;
	        } else {
	          rightPos = coords(to - 1, "right");
	          if (dir == "rtl") { var tmp = leftPos; leftPos = rightPos; rightPos = tmp; }
	          left = leftPos.left;
	          right = rightPos.right;
	        }
	        if (fromArg == null && from == 0) left = leftSide;
	        if (rightPos.top - leftPos.top > 3) { // Different lines, draw top part
	          add(left, leftPos.top, null, leftPos.bottom);
	          left = leftSide;
	          if (leftPos.bottom < rightPos.top) add(left, leftPos.bottom, null, rightPos.top);
	        }
	        if (toArg == null && to == lineLen) right = rightSide;
	        if (!start || leftPos.top < start.top || leftPos.top == start.top && leftPos.left < start.left)
	          start = leftPos;
	        if (!end || rightPos.bottom > end.bottom || rightPos.bottom == end.bottom && rightPos.right > end.right)
	          end = rightPos;
	        if (left < leftSide + 1) left = leftSide;
	        add(left, rightPos.top, right - left, rightPos.bottom);
	      });
	      return {start: start, end: end};
	    }

	    var sFrom = range.from(), sTo = range.to();
	    if (sFrom.line == sTo.line) {
	      drawForLine(sFrom.line, sFrom.ch, sTo.ch);
	    } else {
	      var fromLine = getLine(doc, sFrom.line), toLine = getLine(doc, sTo.line);
	      var singleVLine = visualLine(fromLine) == visualLine(toLine);
	      var leftEnd = drawForLine(sFrom.line, sFrom.ch, singleVLine ? fromLine.text.length + 1 : null).end;
	      var rightStart = drawForLine(sTo.line, singleVLine ? 0 : null, sTo.ch).start;
	      if (singleVLine) {
	        if (leftEnd.top < rightStart.top - 2) {
	          add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
	          add(leftSide, rightStart.top, rightStart.left, rightStart.bottom);
	        } else {
	          add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
	        }
	      }
	      if (leftEnd.bottom < rightStart.top)
	        add(leftSide, leftEnd.bottom, null, rightStart.top);
	    }

	    output.appendChild(fragment);
	  }

	  // Cursor-blinking
	  function restartBlink(cm) {
	    if (!cm.state.focused) return;
	    var display = cm.display;
	    clearInterval(display.blinker);
	    var on = true;
	    display.cursorDiv.style.visibility = "";
	    if (cm.options.cursorBlinkRate > 0)
	      display.blinker = setInterval(function() {
	        display.cursorDiv.style.visibility = (on = !on) ? "" : "hidden";
	      }, cm.options.cursorBlinkRate);
	    else if (cm.options.cursorBlinkRate < 0)
	      display.cursorDiv.style.visibility = "hidden";
	  }

	  // HIGHLIGHT WORKER

	  function startWorker(cm, time) {
	    if (cm.doc.mode.startState && cm.doc.frontier < cm.display.viewTo)
	      cm.state.highlight.set(time, bind(highlightWorker, cm));
	  }

	  function highlightWorker(cm) {
	    var doc = cm.doc;
	    if (doc.frontier < doc.first) doc.frontier = doc.first;
	    if (doc.frontier >= cm.display.viewTo) return;
	    var end = +new Date + cm.options.workTime;
	    var state = copyState(doc.mode, getStateBefore(cm, doc.frontier));
	    var changedLines = [];

	    doc.iter(doc.frontier, Math.min(doc.first + doc.size, cm.display.viewTo + 500), function(line) {
	      if (doc.frontier >= cm.display.viewFrom) { // Visible
	        var oldStyles = line.styles, tooLong = line.text.length > cm.options.maxHighlightLength;
	        var highlighted = highlightLine(cm, line, tooLong ? copyState(doc.mode, state) : state, true);
	        line.styles = highlighted.styles;
	        var oldCls = line.styleClasses, newCls = highlighted.classes;
	        if (newCls) line.styleClasses = newCls;
	        else if (oldCls) line.styleClasses = null;
	        var ischange = !oldStyles || oldStyles.length != line.styles.length ||
	          oldCls != newCls && (!oldCls || !newCls || oldCls.bgClass != newCls.bgClass || oldCls.textClass != newCls.textClass);
	        for (var i = 0; !ischange && i < oldStyles.length; ++i) ischange = oldStyles[i] != line.styles[i];
	        if (ischange) changedLines.push(doc.frontier);
	        line.stateAfter = tooLong ? state : copyState(doc.mode, state);
	      } else {
	        if (line.text.length <= cm.options.maxHighlightLength)
	          processLine(cm, line.text, state);
	        line.stateAfter = doc.frontier % 5 == 0 ? copyState(doc.mode, state) : null;
	      }
	      ++doc.frontier;
	      if (+new Date > end) {
	        startWorker(cm, cm.options.workDelay);
	        return true;
	      }
	    });
	    if (changedLines.length) runInOp(cm, function() {
	      for (var i = 0; i < changedLines.length; i++)
	        regLineChange(cm, changedLines[i], "text");
	    });
	  }

	  // Finds the line to start with when starting a parse. Tries to
	  // find a line with a stateAfter, so that it can start with a
	  // valid state. If that fails, it returns the line with the
	  // smallest indentation, which tends to need the least context to
	  // parse correctly.
	  function findStartLine(cm, n, precise) {
	    var minindent, minline, doc = cm.doc;
	    var lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1000 : 100);
	    for (var search = n; search > lim; --search) {
	      if (search <= doc.first) return doc.first;
	      var line = getLine(doc, search - 1);
	      if (line.stateAfter && (!precise || search <= doc.frontier)) return search;
	      var indented = countColumn(line.text, null, cm.options.tabSize);
	      if (minline == null || minindent > indented) {
	        minline = search - 1;
	        minindent = indented;
	      }
	    }
	    return minline;
	  }

	  function getStateBefore(cm, n, precise) {
	    var doc = cm.doc, display = cm.display;
	    if (!doc.mode.startState) return true;
	    var pos = findStartLine(cm, n, precise), state = pos > doc.first && getLine(doc, pos-1).stateAfter;
	    if (!state) state = startState(doc.mode);
	    else state = copyState(doc.mode, state);
	    doc.iter(pos, n, function(line) {
	      processLine(cm, line.text, state);
	      var save = pos == n - 1 || pos % 5 == 0 || pos >= display.viewFrom && pos < display.viewTo;
	      line.stateAfter = save ? copyState(doc.mode, state) : null;
	      ++pos;
	    });
	    if (precise) doc.frontier = pos;
	    return state;
	  }

	  // POSITION MEASUREMENT

	  function paddingTop(display) {return display.lineSpace.offsetTop;}
	  function paddingVert(display) {return display.mover.offsetHeight - display.lineSpace.offsetHeight;}
	  function paddingH(display) {
	    if (display.cachedPaddingH) return display.cachedPaddingH;
	    var e = removeChildrenAndAdd(display.measure, elt("pre", "x"));
	    var style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle;
	    var data = {left: parseInt(style.paddingLeft), right: parseInt(style.paddingRight)};
	    if (!isNaN(data.left) && !isNaN(data.right)) display.cachedPaddingH = data;
	    return data;
	  }

	  function scrollGap(cm) { return scrollerGap - cm.display.nativeBarWidth; }
	  function displayWidth(cm) {
	    return cm.display.scroller.clientWidth - scrollGap(cm) - cm.display.barWidth;
	  }
	  function displayHeight(cm) {
	    return cm.display.scroller.clientHeight - scrollGap(cm) - cm.display.barHeight;
	  }

	  // Ensure the lineView.wrapping.heights array is populated. This is
	  // an array of bottom offsets for the lines that make up a drawn
	  // line. When lineWrapping is on, there might be more than one
	  // height.
	  function ensureLineHeights(cm, lineView, rect) {
	    var wrapping = cm.options.lineWrapping;
	    var curWidth = wrapping && displayWidth(cm);
	    if (!lineView.measure.heights || wrapping && lineView.measure.width != curWidth) {
	      var heights = lineView.measure.heights = [];
	      if (wrapping) {
	        lineView.measure.width = curWidth;
	        var rects = lineView.text.firstChild.getClientRects();
	        for (var i = 0; i < rects.length - 1; i++) {
	          var cur = rects[i], next = rects[i + 1];
	          if (Math.abs(cur.bottom - next.bottom) > 2)
	            heights.push((cur.bottom + next.top) / 2 - rect.top);
	        }
	      }
	      heights.push(rect.bottom - rect.top);
	    }
	  }

	  // Find a line map (mapping character offsets to text nodes) and a
	  // measurement cache for the given line number. (A line view might
	  // contain multiple lines when collapsed ranges are present.)
	  function mapFromLineView(lineView, line, lineN) {
	    if (lineView.line == line)
	      return {map: lineView.measure.map, cache: lineView.measure.cache};
	    for (var i = 0; i < lineView.rest.length; i++)
	      if (lineView.rest[i] == line)
	        return {map: lineView.measure.maps[i], cache: lineView.measure.caches[i]};
	    for (var i = 0; i < lineView.rest.length; i++)
	      if (lineNo(lineView.rest[i]) > lineN)
	        return {map: lineView.measure.maps[i], cache: lineView.measure.caches[i], before: true};
	  }

	  // Render a line into the hidden node display.externalMeasured. Used
	  // when measurement is needed for a line that's not in the viewport.
	  function updateExternalMeasurement(cm, line) {
	    line = visualLine(line);
	    var lineN = lineNo(line);
	    var view = cm.display.externalMeasured = new LineView(cm.doc, line, lineN);
	    view.lineN = lineN;
	    var built = view.built = buildLineContent(cm, view);
	    view.text = built.pre;
	    removeChildrenAndAdd(cm.display.lineMeasure, built.pre);
	    return view;
	  }

	  // Get a {top, bottom, left, right} box (in line-local coordinates)
	  // for a given character.
	  function measureChar(cm, line, ch, bias) {
	    return measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, bias);
	  }

	  // Find a line view that corresponds to the given line number.
	  function findViewForLine(cm, lineN) {
	    if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo)
	      return cm.display.view[findViewIndex(cm, lineN)];
	    var ext = cm.display.externalMeasured;
	    if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size)
	      return ext;
	  }

	  // Measurement can be split in two steps, the set-up work that
	  // applies to the whole line, and the measurement of the actual
	  // character. Functions like coordsChar, that need to do a lot of
	  // measurements in a row, can thus ensure that the set-up work is
	  // only done once.
	  function prepareMeasureForLine(cm, line) {
	    var lineN = lineNo(line);
	    var view = findViewForLine(cm, lineN);
	    if (view && !view.text) {
	      view = null;
	    } else if (view && view.changes) {
	      updateLineForChanges(cm, view, lineN, getDimensions(cm));
	      cm.curOp.forceUpdate = true;
	    }
	    if (!view)
	      view = updateExternalMeasurement(cm, line);

	    var info = mapFromLineView(view, line, lineN);
	    return {
	      line: line, view: view, rect: null,
	      map: info.map, cache: info.cache, before: info.before,
	      hasHeights: false
	    };
	  }

	  // Given a prepared measurement object, measures the position of an
	  // actual character (or fetches it from the cache).
	  function measureCharPrepared(cm, prepared, ch, bias, varHeight) {
	    if (prepared.before) ch = -1;
	    var key = ch + (bias || ""), found;
	    if (prepared.cache.hasOwnProperty(key)) {
	      found = prepared.cache[key];
	    } else {
	      if (!prepared.rect)
	        prepared.rect = prepared.view.text.getBoundingClientRect();
	      if (!prepared.hasHeights) {
	        ensureLineHeights(cm, prepared.view, prepared.rect);
	        prepared.hasHeights = true;
	      }
	      found = measureCharInner(cm, prepared, ch, bias);
	      if (!found.bogus) prepared.cache[key] = found;
	    }
	    return {left: found.left, right: found.right,
	            top: varHeight ? found.rtop : found.top,
	            bottom: varHeight ? found.rbottom : found.bottom};
	  }

	  var nullRect = {left: 0, right: 0, top: 0, bottom: 0};

	  function nodeAndOffsetInLineMap(map, ch, bias) {
	    var node, start, end, collapse;
	    // First, search the line map for the text node corresponding to,
	    // or closest to, the target character.
	    for (var i = 0; i < map.length; i += 3) {
	      var mStart = map[i], mEnd = map[i + 1];
	      if (ch < mStart) {
	        start = 0; end = 1;
	        collapse = "left";
	      } else if (ch < mEnd) {
	        start = ch - mStart;
	        end = start + 1;
	      } else if (i == map.length - 3 || ch == mEnd && map[i + 3] > ch) {
	        end = mEnd - mStart;
	        start = end - 1;
	        if (ch >= mEnd) collapse = "right";
	      }
	      if (start != null) {
	        node = map[i + 2];
	        if (mStart == mEnd && bias == (node.insertLeft ? "left" : "right"))
	          collapse = bias;
	        if (bias == "left" && start == 0)
	          while (i && map[i - 2] == map[i - 3] && map[i - 1].insertLeft) {
	            node = map[(i -= 3) + 2];
	            collapse = "left";
	          }
	        if (bias == "right" && start == mEnd - mStart)
	          while (i < map.length - 3 && map[i + 3] == map[i + 4] && !map[i + 5].insertLeft) {
	            node = map[(i += 3) + 2];
	            collapse = "right";
	          }
	        break;
	      }
	    }
	    return {node: node, start: start, end: end, collapse: collapse, coverStart: mStart, coverEnd: mEnd};
	  }

	  function getUsefulRect(rects, bias) {
	    var rect = nullRect
	    if (bias == "left") for (var i = 0; i < rects.length; i++) {
	      if ((rect = rects[i]).left != rect.right) break
	    } else for (var i = rects.length - 1; i >= 0; i--) {
	      if ((rect = rects[i]).left != rect.right) break
	    }
	    return rect
	  }

	  function measureCharInner(cm, prepared, ch, bias) {
	    var place = nodeAndOffsetInLineMap(prepared.map, ch, bias);
	    var node = place.node, start = place.start, end = place.end, collapse = place.collapse;

	    var rect;
	    if (node.nodeType == 3) { // If it is a text node, use a range to retrieve the coordinates.
	      for (var i = 0; i < 4; i++) { // Retry a maximum of 4 times when nonsense rectangles are returned
	        while (start && isExtendingChar(prepared.line.text.charAt(place.coverStart + start))) --start;
	        while (place.coverStart + end < place.coverEnd && isExtendingChar(prepared.line.text.charAt(place.coverStart + end))) ++end;
	        if (ie && ie_version < 9 && start == 0 && end == place.coverEnd - place.coverStart)
	          rect = node.parentNode.getBoundingClientRect();
	        else
	          rect = getUsefulRect(range(node, start, end).getClientRects(), bias)
	        if (rect.left || rect.right || start == 0) break;
	        end = start;
	        start = start - 1;
	        collapse = "right";
	      }
	      if (ie && ie_version < 11) rect = maybeUpdateRectForZooming(cm.display.measure, rect);
	    } else { // If it is a widget, simply get the box for the whole widget.
	      if (start > 0) collapse = bias = "right";
	      var rects;
	      if (cm.options.lineWrapping && (rects = node.getClientRects()).length > 1)
	        rect = rects[bias == "right" ? rects.length - 1 : 0];
	      else
	        rect = node.getBoundingClientRect();
	    }
	    if (ie && ie_version < 9 && !start && (!rect || !rect.left && !rect.right)) {
	      var rSpan = node.parentNode.getClientRects()[0];
	      if (rSpan)
	        rect = {left: rSpan.left, right: rSpan.left + charWidth(cm.display), top: rSpan.top, bottom: rSpan.bottom};
	      else
	        rect = nullRect;
	    }

	    var rtop = rect.top - prepared.rect.top, rbot = rect.bottom - prepared.rect.top;
	    var mid = (rtop + rbot) / 2;
	    var heights = prepared.view.measure.heights;
	    for (var i = 0; i < heights.length - 1; i++)
	      if (mid < heights[i]) break;
	    var top = i ? heights[i - 1] : 0, bot = heights[i];
	    var result = {left: (collapse == "right" ? rect.right : rect.left) - prepared.rect.left,
	                  right: (collapse == "left" ? rect.left : rect.right) - prepared.rect.left,
	                  top: top, bottom: bot};
	    if (!rect.left && !rect.right) result.bogus = true;
	    if (!cm.options.singleCursorHeightPerLine) { result.rtop = rtop; result.rbottom = rbot; }

	    return result;
	  }

	  // Work around problem with bounding client rects on ranges being
	  // returned incorrectly when zoomed on IE10 and below.
	  function maybeUpdateRectForZooming(measure, rect) {
	    if (!window.screen || screen.logicalXDPI == null ||
	        screen.logicalXDPI == screen.deviceXDPI || !hasBadZoomedRects(measure))
	      return rect;
	    var scaleX = screen.logicalXDPI / screen.deviceXDPI;
	    var scaleY = screen.logicalYDPI / screen.deviceYDPI;
	    return {left: rect.left * scaleX, right: rect.right * scaleX,
	            top: rect.top * scaleY, bottom: rect.bottom * scaleY};
	  }

	  function clearLineMeasurementCacheFor(lineView) {
	    if (lineView.measure) {
	      lineView.measure.cache = {};
	      lineView.measure.heights = null;
	      if (lineView.rest) for (var i = 0; i < lineView.rest.length; i++)
	        lineView.measure.caches[i] = {};
	    }
	  }

	  function clearLineMeasurementCache(cm) {
	    cm.display.externalMeasure = null;
	    removeChildren(cm.display.lineMeasure);
	    for (var i = 0; i < cm.display.view.length; i++)
	      clearLineMeasurementCacheFor(cm.display.view[i]);
	  }

	  function clearCaches(cm) {
	    clearLineMeasurementCache(cm);
	    cm.display.cachedCharWidth = cm.display.cachedTextHeight = cm.display.cachedPaddingH = null;
	    if (!cm.options.lineWrapping) cm.display.maxLineChanged = true;
	    cm.display.lineNumChars = null;
	  }

	  function pageScrollX() { return window.pageXOffset || (document.documentElement || document.body).scrollLeft; }
	  function pageScrollY() { return window.pageYOffset || (document.documentElement || document.body).scrollTop; }

	  // Converts a {top, bottom, left, right} box from line-local
	  // coordinates into another coordinate system. Context may be one of
	  // "line", "div" (display.lineDiv), "local"/null (editor), "window",
	  // or "page".
	  function intoCoordSystem(cm, lineObj, rect, context) {
	    if (lineObj.widgets) for (var i = 0; i < lineObj.widgets.length; ++i) if (lineObj.widgets[i].above) {
	      var size = widgetHeight(lineObj.widgets[i]);
	      rect.top += size; rect.bottom += size;
	    }
	    if (context == "line") return rect;
	    if (!context) context = "local";
	    var yOff = heightAtLine(lineObj);
	    if (context == "local") yOff += paddingTop(cm.display);
	    else yOff -= cm.display.viewOffset;
	    if (context == "page" || context == "window") {
	      var lOff = cm.display.lineSpace.getBoundingClientRect();
	      yOff += lOff.top + (context == "window" ? 0 : pageScrollY());
	      var xOff = lOff.left + (context == "window" ? 0 : pageScrollX());
	      rect.left += xOff; rect.right += xOff;
	    }
	    rect.top += yOff; rect.bottom += yOff;
	    return rect;
	  }

	  // Coverts a box from "div" coords to another coordinate system.
	  // Context may be "window", "page", "div", or "local"/null.
	  function fromCoordSystem(cm, coords, context) {
	    if (context == "div") return coords;
	    var left = coords.left, top = coords.top;
	    // First move into "page" coordinate system
	    if (context == "page") {
	      left -= pageScrollX();
	      top -= pageScrollY();
	    } else if (context == "local" || !context) {
	      var localBox = cm.display.sizer.getBoundingClientRect();
	      left += localBox.left;
	      top += localBox.top;
	    }

	    var lineSpaceBox = cm.display.lineSpace.getBoundingClientRect();
	    return {left: left - lineSpaceBox.left, top: top - lineSpaceBox.top};
	  }

	  function charCoords(cm, pos, context, lineObj, bias) {
	    if (!lineObj) lineObj = getLine(cm.doc, pos.line);
	    return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, bias), context);
	  }

	  // Returns a box for a given cursor position, which may have an
	  // 'other' property containing the position of the secondary cursor
	  // on a bidi boundary.
	  function cursorCoords(cm, pos, context, lineObj, preparedMeasure, varHeight) {
	    lineObj = lineObj || getLine(cm.doc, pos.line);
	    if (!preparedMeasure) preparedMeasure = prepareMeasureForLine(cm, lineObj);
	    function get(ch, right) {
	      var m = measureCharPrepared(cm, preparedMeasure, ch, right ? "right" : "left", varHeight);
	      if (right) m.left = m.right; else m.right = m.left;
	      return intoCoordSystem(cm, lineObj, m, context);
	    }
	    function getBidi(ch, partPos) {
	      var part = order[partPos], right = part.level % 2;
	      if (ch == bidiLeft(part) && partPos && part.level < order[partPos - 1].level) {
	        part = order[--partPos];
	        ch = bidiRight(part) - (part.level % 2 ? 0 : 1);
	        right = true;
	      } else if (ch == bidiRight(part) && partPos < order.length - 1 && part.level < order[partPos + 1].level) {
	        part = order[++partPos];
	        ch = bidiLeft(part) - part.level % 2;
	        right = false;
	      }
	      if (right && ch == part.to && ch > part.from) return get(ch - 1);
	      return get(ch, right);
	    }
	    var order = getOrder(lineObj), ch = pos.ch;
	    if (!order) return get(ch);
	    var partPos = getBidiPartAt(order, ch);
	    var val = getBidi(ch, partPos);
	    if (bidiOther != null) val.other = getBidi(ch, bidiOther);
	    return val;
	  }

	  // Used to cheaply estimate the coordinates for a position. Used for
	  // intermediate scroll updates.
	  function estimateCoords(cm, pos) {
	    var left = 0, pos = clipPos(cm.doc, pos);
	    if (!cm.options.lineWrapping) left = charWidth(cm.display) * pos.ch;
	    var lineObj = getLine(cm.doc, pos.line);
	    var top = heightAtLine(lineObj) + paddingTop(cm.display);
	    return {left: left, right: left, top: top, bottom: top + lineObj.height};
	  }

	  // Positions returned by coordsChar contain some extra information.
	  // xRel is the relative x position of the input coordinates compared
	  // to the found position (so xRel > 0 means the coordinates are to
	  // the right of the character position, for example). When outside
	  // is true, that means the coordinates lie outside the line's
	  // vertical range.
	  function PosWithInfo(line, ch, outside, xRel) {
	    var pos = Pos(line, ch);
	    pos.xRel = xRel;
	    if (outside) pos.outside = true;
	    return pos;
	  }

	  // Compute the character position closest to the given coordinates.
	  // Input must be lineSpace-local ("div" coordinate system).
	  function coordsChar(cm, x, y) {
	    var doc = cm.doc;
	    y += cm.display.viewOffset;
	    if (y < 0) return PosWithInfo(doc.first, 0, true, -1);
	    var lineN = lineAtHeight(doc, y), last = doc.first + doc.size - 1;
	    if (lineN > last)
	      return PosWithInfo(doc.first + doc.size - 1, getLine(doc, last).text.length, true, 1);
	    if (x < 0) x = 0;

	    var lineObj = getLine(doc, lineN);
	    for (;;) {
	      var found = coordsCharInner(cm, lineObj, lineN, x, y);
	      var merged = collapsedSpanAtEnd(lineObj);
	      var mergedPos = merged && merged.find(0, true);
	      if (merged && (found.ch > mergedPos.from.ch || found.ch == mergedPos.from.ch && found.xRel > 0))
	        lineN = lineNo(lineObj = mergedPos.to.line);
	      else
	        return found;
	    }
	  }

	  function coordsCharInner(cm, lineObj, lineNo, x, y) {
	    var innerOff = y - heightAtLine(lineObj);
	    var wrongLine = false, adjust = 2 * cm.display.wrapper.clientWidth;
	    var preparedMeasure = prepareMeasureForLine(cm, lineObj);

	    function getX(ch) {
	      var sp = cursorCoords(cm, Pos(lineNo, ch), "line", lineObj, preparedMeasure);
	      wrongLine = true;
	      if (innerOff > sp.bottom) return sp.left - adjust;
	      else if (innerOff < sp.top) return sp.left + adjust;
	      else wrongLine = false;
	      return sp.left;
	    }

	    var bidi = getOrder(lineObj), dist = lineObj.text.length;
	    var from = lineLeft(lineObj), to = lineRight(lineObj);
	    var fromX = getX(from), fromOutside = wrongLine, toX = getX(to), toOutside = wrongLine;

	    if (x > toX) return PosWithInfo(lineNo, to, toOutside, 1);
	    // Do a binary search between these bounds.
	    for (;;) {
	      if (bidi ? to == from || to == moveVisually(lineObj, from, 1) : to - from <= 1) {
	        var ch = x < fromX || x - fromX <= toX - x ? from : to;
	        var outside = ch == from ? fromOutside : toOutside
	        var xDiff = x - (ch == from ? fromX : toX);
	        // This is a kludge to handle the case where the coordinates
	        // are after a line-wrapped line. We should replace it with a
	        // more general handling of cursor positions around line
	        // breaks. (Issue #4078)
	        if (toOutside && !bidi && !/\s/.test(lineObj.text.charAt(ch)) && xDiff > 0 &&
	            ch < lineObj.text.length && preparedMeasure.view.measure.heights.length > 1) {
	          var charSize = measureCharPrepared(cm, preparedMeasure, ch, "right");
	          if (innerOff <= charSize.bottom && innerOff >= charSize.top && Math.abs(x - charSize.right) < xDiff) {
	            outside = false
	            ch++
	            xDiff = x - charSize.right
	          }
	        }
	        while (isExtendingChar(lineObj.text.charAt(ch))) ++ch;
	        var pos = PosWithInfo(lineNo, ch, outside, xDiff < -1 ? -1 : xDiff > 1 ? 1 : 0);
	        return pos;
	      }
	      var step = Math.ceil(dist / 2), middle = from + step;
	      if (bidi) {
	        middle = from;
	        for (var i = 0; i < step; ++i) middle = moveVisually(lineObj, middle, 1);
	      }
	      var middleX = getX(middle);
	      if (middleX > x) {to = middle; toX = middleX; if (toOutside = wrongLine) toX += 1000; dist = step;}
	      else {from = middle; fromX = middleX; fromOutside = wrongLine; dist -= step;}
	    }
	  }

	  var measureText;
	  // Compute the default text height.
	  function textHeight(display) {
	    if (display.cachedTextHeight != null) return display.cachedTextHeight;
	    if (measureText == null) {
	      measureText = elt("pre");
	      // Measure a bunch of lines, for browsers that compute
	      // fractional heights.
	      for (var i = 0; i < 49; ++i) {
	        measureText.appendChild(document.createTextNode("x"));
	        measureText.appendChild(elt("br"));
	      }
	      measureText.appendChild(document.createTextNode("x"));
	    }
	    removeChildrenAndAdd(display.measure, measureText);
	    var height = measureText.offsetHeight / 50;
	    if (height > 3) display.cachedTextHeight = height;
	    removeChildren(display.measure);
	    return height || 1;
	  }

	  // Compute the default character width.
	  function charWidth(display) {
	    if (display.cachedCharWidth != null) return display.cachedCharWidth;
	    var anchor = elt("span", "xxxxxxxxxx");
	    var pre = elt("pre", [anchor]);
	    removeChildrenAndAdd(display.measure, pre);
	    var rect = anchor.getBoundingClientRect(), width = (rect.right - rect.left) / 10;
	    if (width > 2) display.cachedCharWidth = width;
	    return width || 10;
	  }

	  // OPERATIONS

	  // Operations are used to wrap a series of changes to the editor
	  // state in such a way that each change won't have to update the
	  // cursor and display (which would be awkward, slow, and
	  // error-prone). Instead, display updates are batched and then all
	  // combined and executed at once.

	  var operationGroup = null;

	  var nextOpId = 0;
	  // Start a new operation.
	  function startOperation(cm) {
	    cm.curOp = {
	      cm: cm,
	      viewChanged: false,      // Flag that indicates that lines might need to be redrawn
	      startHeight: cm.doc.height, // Used to detect need to update scrollbar
	      forceUpdate: false,      // Used to force a redraw
	      updateInput: null,       // Whether to reset the input textarea
	      typing: false,           // Whether this reset should be careful to leave existing text (for compositing)
	      changeObjs: null,        // Accumulated changes, for firing change events
	      cursorActivityHandlers: null, // Set of handlers to fire cursorActivity on
	      cursorActivityCalled: 0, // Tracks which cursorActivity handlers have been called already
	      selectionChanged: false, // Whether the selection needs to be redrawn
	      updateMaxLine: false,    // Set when the widest line needs to be determined anew
	      scrollLeft: null, scrollTop: null, // Intermediate scroll position, not pushed to DOM yet
	      scrollToPos: null,       // Used to scroll to a specific position
	      focus: false,
	      id: ++nextOpId           // Unique ID
	    };
	    if (operationGroup) {
	      operationGroup.ops.push(cm.curOp);
	    } else {
	      cm.curOp.ownsGroup = operationGroup = {
	        ops: [cm.curOp],
	        delayedCallbacks: []
	      };
	    }
	  }

	  function fireCallbacksForOps(group) {
	    // Calls delayed callbacks and cursorActivity handlers until no
	    // new ones appear
	    var callbacks = group.delayedCallbacks, i = 0;
	    do {
	      for (; i < callbacks.length; i++)
	        callbacks[i].call(null);
	      for (var j = 0; j < group.ops.length; j++) {
	        var op = group.ops[j];
	        if (op.cursorActivityHandlers)
	          while (op.cursorActivityCalled < op.cursorActivityHandlers.length)
	            op.cursorActivityHandlers[op.cursorActivityCalled++].call(null, op.cm);
	      }
	    } while (i < callbacks.length);
	  }

	  // Finish an operation, updating the display and signalling delayed events
	  function endOperation(cm) {
	    var op = cm.curOp, group = op.ownsGroup;
	    if (!group) return;

	    try { fireCallbacksForOps(group); }
	    finally {
	      operationGroup = null;
	      for (var i = 0; i < group.ops.length; i++)
	        group.ops[i].cm.curOp = null;
	      endOperations(group);
	    }
	  }

	  // The DOM updates done when an operation finishes are batched so
	  // that the minimum number of relayouts are required.
	  function endOperations(group) {
	    var ops = group.ops;
	    for (var i = 0; i < ops.length; i++) // Read DOM
	      endOperation_R1(ops[i]);
	    for (var i = 0; i < ops.length; i++) // Write DOM (maybe)
	      endOperation_W1(ops[i]);
	    for (var i = 0; i < ops.length; i++) // Read DOM
	      endOperation_R2(ops[i]);
	    for (var i = 0; i < ops.length; i++) // Write DOM (maybe)
	      endOperation_W2(ops[i]);
	    for (var i = 0; i < ops.length; i++) // Read DOM
	      endOperation_finish(ops[i]);
	  }

	  function endOperation_R1(op) {
	    var cm = op.cm, display = cm.display;
	    maybeClipScrollbars(cm);
	    if (op.updateMaxLine) findMaxLine(cm);

	    op.mustUpdate = op.viewChanged || op.forceUpdate || op.scrollTop != null ||
	      op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom ||
	                         op.scrollToPos.to.line >= display.viewTo) ||
	      display.maxLineChanged && cm.options.lineWrapping;
	    op.update = op.mustUpdate &&
	      new DisplayUpdate(cm, op.mustUpdate && {top: op.scrollTop, ensure: op.scrollToPos}, op.forceUpdate);
	  }

	  function endOperation_W1(op) {
	    op.updatedDisplay = op.mustUpdate && updateDisplayIfNeeded(op.cm, op.update);
	  }

	  function endOperation_R2(op) {
	    var cm = op.cm, display = cm.display;
	    if (op.updatedDisplay) updateHeightsInViewport(cm);

	    op.barMeasure = measureForScrollbars(cm);

	    // If the max line changed since it was last measured, measure it,
	    // and ensure the document's width matches it.
	    // updateDisplay_W2 will use these properties to do the actual resizing
	    if (display.maxLineChanged && !cm.options.lineWrapping) {
	      op.adjustWidthTo = measureChar(cm, display.maxLine, display.maxLine.text.length).left + 3;
	      cm.display.sizerWidth = op.adjustWidthTo;
	      op.barMeasure.scrollWidth =
	        Math.max(display.scroller.clientWidth, display.sizer.offsetLeft + op.adjustWidthTo + scrollGap(cm) + cm.display.barWidth);
	      op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo - displayWidth(cm));
	    }

	    if (op.updatedDisplay || op.selectionChanged)
	      op.preparedSelection = display.input.prepareSelection(op.focus);
	  }

	  function endOperation_W2(op) {
	    var cm = op.cm;

	    if (op.adjustWidthTo != null) {
	      cm.display.sizer.style.minWidth = op.adjustWidthTo + "px";
	      if (op.maxScrollLeft < cm.doc.scrollLeft)
	        setScrollLeft(cm, Math.min(cm.display.scroller.scrollLeft, op.maxScrollLeft), true);
	      cm.display.maxLineChanged = false;
	    }

	    var takeFocus = op.focus && op.focus == activeElt() && (!document.hasFocus || document.hasFocus())
	    if (op.preparedSelection)
	      cm.display.input.showSelection(op.preparedSelection, takeFocus);
	    if (op.updatedDisplay || op.startHeight != cm.doc.height)
	      updateScrollbars(cm, op.barMeasure);
	    if (op.updatedDisplay)
	      setDocumentHeight(cm, op.barMeasure);

	    if (op.selectionChanged) restartBlink(cm);

	    if (cm.state.focused && op.updateInput)
	      cm.display.input.reset(op.typing);
	    if (takeFocus) ensureFocus(op.cm);
	  }

	  function endOperation_finish(op) {
	    var cm = op.cm, display = cm.display, doc = cm.doc;

	    if (op.updatedDisplay) postUpdateDisplay(cm, op.update);

	    // Abort mouse wheel delta measurement, when scrolling explicitly
	    if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos))
	      display.wheelStartX = display.wheelStartY = null;

	    // Propagate the scroll position to the actual DOM scroller
	    if (op.scrollTop != null && (display.scroller.scrollTop != op.scrollTop || op.forceScroll)) {
	      doc.scrollTop = Math.max(0, Math.min(display.scroller.scrollHeight - display.scroller.clientHeight, op.scrollTop));
	      display.scrollbars.setScrollTop(doc.scrollTop);
	      display.scroller.scrollTop = doc.scrollTop;
	    }
	    if (op.scrollLeft != null && (display.scroller.scrollLeft != op.scrollLeft || op.forceScroll)) {
	      doc.scrollLeft = Math.max(0, Math.min(display.scroller.scrollWidth - display.scroller.clientWidth, op.scrollLeft));
	      display.scrollbars.setScrollLeft(doc.scrollLeft);
	      display.scroller.scrollLeft = doc.scrollLeft;
	      alignHorizontally(cm);
	    }
	    // If we need to scroll a specific position into view, do so.
	    if (op.scrollToPos) {
	      var coords = scrollPosIntoView(cm, clipPos(doc, op.scrollToPos.from),
	                                     clipPos(doc, op.scrollToPos.to), op.scrollToPos.margin);
	      if (op.scrollToPos.isCursor && cm.state.focused) maybeScrollWindow(cm, coords);
	    }

	    // Fire events for markers that are hidden/unidden by editing or
	    // undoing
	    var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
	    if (hidden) for (var i = 0; i < hidden.length; ++i)
	      if (!hidden[i].lines.length) signal(hidden[i], "hide");
	    if (unhidden) for (var i = 0; i < unhidden.length; ++i)
	      if (unhidden[i].lines.length) signal(unhidden[i], "unhide");

	    if (display.wrapper.offsetHeight)
	      doc.scrollTop = cm.display.scroller.scrollTop;

	    // Fire change events, and delayed event handlers
	    if (op.changeObjs)
	      signal(cm, "changes", cm, op.changeObjs);
	    if (op.update)
	      op.update.finish();
	  }

	  // Run the given function in an operation
	  function runInOp(cm, f) {
	    if (cm.curOp) return f();
	    startOperation(cm);
	    try { return f(); }
	    finally { endOperation(cm); }
	  }
	  // Wraps a function in an operation. Returns the wrapped function.
	  function operation(cm, f) {
	    return function() {
	      if (cm.curOp) return f.apply(cm, arguments);
	      startOperation(cm);
	      try { return f.apply(cm, arguments); }
	      finally { endOperation(cm); }
	    };
	  }
	  // Used to add methods to editor and doc instances, wrapping them in
	  // operations.
	  function methodOp(f) {
	    return function() {
	      if (this.curOp) return f.apply(this, arguments);
	      startOperation(this);
	      try { return f.apply(this, arguments); }
	      finally { endOperation(this); }
	    };
	  }
	  function docMethodOp(f) {
	    return function() {
	      var cm = this.cm;
	      if (!cm || cm.curOp) return f.apply(this, arguments);
	      startOperation(cm);
	      try { return f.apply(this, arguments); }
	      finally { endOperation(cm); }
	    };
	  }

	  // VIEW TRACKING

	  // These objects are used to represent the visible (currently drawn)
	  // part of the document. A LineView may correspond to multiple
	  // logical lines, if those are connected by collapsed ranges.
	  function LineView(doc, line, lineN) {
	    // The starting line
	    this.line = line;
	    // Continuing lines, if any
	    this.rest = visualLineContinued(line);
	    // Number of logical lines in this visual line
	    this.size = this.rest ? lineNo(lst(this.rest)) - lineN + 1 : 1;
	    this.node = this.text = null;
	    this.hidden = lineIsHidden(doc, line);
	  }

	  // Create a range of LineView objects for the given lines.
	  function buildViewArray(cm, from, to) {
	    var array = [], nextPos;
	    for (var pos = from; pos < to; pos = nextPos) {
	      var view = new LineView(cm.doc, getLine(cm.doc, pos), pos);
	      nextPos = pos + view.size;
	      array.push(view);
	    }
	    return array;
	  }

	  // Updates the display.view data structure for a given change to the
	  // document. From and to are in pre-change coordinates. Lendiff is
	  // the amount of lines added or subtracted by the change. This is
	  // used for changes that span multiple lines, or change the way
	  // lines are divided into visual lines. regLineChange (below)
	  // registers single-line changes.
	  function regChange(cm, from, to, lendiff) {
	    if (from == null) from = cm.doc.first;
	    if (to == null) to = cm.doc.first + cm.doc.size;
	    if (!lendiff) lendiff = 0;

	    var display = cm.display;
	    if (lendiff && to < display.viewTo &&
	        (display.updateLineNumbers == null || display.updateLineNumbers > from))
	      display.updateLineNumbers = from;

	    cm.curOp.viewChanged = true;

	    if (from >= display.viewTo) { // Change after
	      if (sawCollapsedSpans && visualLineNo(cm.doc, from) < display.viewTo)
	        resetView(cm);
	    } else if (to <= display.viewFrom) { // Change before
	      if (sawCollapsedSpans && visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom) {
	        resetView(cm);
	      } else {
	        display.viewFrom += lendiff;
	        display.viewTo += lendiff;
	      }
	    } else if (from <= display.viewFrom && to >= display.viewTo) { // Full overlap
	      resetView(cm);
	    } else if (from <= display.viewFrom) { // Top overlap
	      var cut = viewCuttingPoint(cm, to, to + lendiff, 1);
	      if (cut) {
	        display.view = display.view.slice(cut.index);
	        display.viewFrom = cut.lineN;
	        display.viewTo += lendiff;
	      } else {
	        resetView(cm);
	      }
	    } else if (to >= display.viewTo) { // Bottom overlap
	      var cut = viewCuttingPoint(cm, from, from, -1);
	      if (cut) {
	        display.view = display.view.slice(0, cut.index);
	        display.viewTo = cut.lineN;
	      } else {
	        resetView(cm);
	      }
	    } else { // Gap in the middle
	      var cutTop = viewCuttingPoint(cm, from, from, -1);
	      var cutBot = viewCuttingPoint(cm, to, to + lendiff, 1);
	      if (cutTop && cutBot) {
	        display.view = display.view.slice(0, cutTop.index)
	          .concat(buildViewArray(cm, cutTop.lineN, cutBot.lineN))
	          .concat(display.view.slice(cutBot.index));
	        display.viewTo += lendiff;
	      } else {
	        resetView(cm);
	      }
	    }

	    var ext = display.externalMeasured;
	    if (ext) {
	      if (to < ext.lineN)
	        ext.lineN += lendiff;
	      else if (from < ext.lineN + ext.size)
	        display.externalMeasured = null;
	    }
	  }

	  // Register a change to a single line. Type must be one of "text",
	  // "gutter", "class", "widget"
	  function regLineChange(cm, line, type) {
	    cm.curOp.viewChanged = true;
	    var display = cm.display, ext = cm.display.externalMeasured;
	    if (ext && line >= ext.lineN && line < ext.lineN + ext.size)
	      display.externalMeasured = null;

	    if (line < display.viewFrom || line >= display.viewTo) return;
	    var lineView = display.view[findViewIndex(cm, line)];
	    if (lineView.node == null) return;
	    var arr = lineView.changes || (lineView.changes = []);
	    if (indexOf(arr, type) == -1) arr.push(type);
	  }

	  // Clear the view.
	  function resetView(cm) {
	    cm.display.viewFrom = cm.display.viewTo = cm.doc.first;
	    cm.display.view = [];
	    cm.display.viewOffset = 0;
	  }

	  // Find the view element corresponding to a given line. Return null
	  // when the line isn't visible.
	  function findViewIndex(cm, n) {
	    if (n >= cm.display.viewTo) return null;
	    n -= cm.display.viewFrom;
	    if (n < 0) return null;
	    var view = cm.display.view;
	    for (var i = 0; i < view.length; i++) {
	      n -= view[i].size;
	      if (n < 0) return i;
	    }
	  }

	  function viewCuttingPoint(cm, oldN, newN, dir) {
	    var index = findViewIndex(cm, oldN), diff, view = cm.display.view;
	    if (!sawCollapsedSpans || newN == cm.doc.first + cm.doc.size)
	      return {index: index, lineN: newN};
	    for (var i = 0, n = cm.display.viewFrom; i < index; i++)
	      n += view[i].size;
	    if (n != oldN) {
	      if (dir > 0) {
	        if (index == view.length - 1) return null;
	        diff = (n + view[index].size) - oldN;
	        index++;
	      } else {
	        diff = n - oldN;
	      }
	      oldN += diff; newN += diff;
	    }
	    while (visualLineNo(cm.doc, newN) != newN) {
	      if (index == (dir < 0 ? 0 : view.length - 1)) return null;
	      newN += dir * view[index - (dir < 0 ? 1 : 0)].size;
	      index += dir;
	    }
	    return {index: index, lineN: newN};
	  }

	  // Force the view to cover a given range, adding empty view element
	  // or clipping off existing ones as needed.
	  function adjustView(cm, from, to) {
	    var display = cm.display, view = display.view;
	    if (view.length == 0 || from >= display.viewTo || to <= display.viewFrom) {
	      display.view = buildViewArray(cm, from, to);
	      display.viewFrom = from;
	    } else {
	      if (display.viewFrom > from)
	        display.view = buildViewArray(cm, from, display.viewFrom).concat(display.view);
	      else if (display.viewFrom < from)
	        display.view = display.view.slice(findViewIndex(cm, from));
	      display.viewFrom = from;
	      if (display.viewTo < to)
	        display.view = display.view.concat(buildViewArray(cm, display.viewTo, to));
	      else if (display.viewTo > to)
	        display.view = display.view.slice(0, findViewIndex(cm, to));
	    }
	    display.viewTo = to;
	  }

	  // Count the number of lines in the view whose DOM representation is
	  // out of date (or nonexistent).
	  function countDirtyView(cm) {
	    var view = cm.display.view, dirty = 0;
	    for (var i = 0; i < view.length; i++) {
	      var lineView = view[i];
	      if (!lineView.hidden && (!lineView.node || lineView.changes)) ++dirty;
	    }
	    return dirty;
	  }

	  // EVENT HANDLERS

	  // Attach the necessary event handlers when initializing the editor
	  function registerEventHandlers(cm) {
	    var d = cm.display;
	    on(d.scroller, "mousedown", operation(cm, onMouseDown));
	    // Older IE's will not fire a second mousedown for a double click
	    if (ie && ie_version < 11)
	      on(d.scroller, "dblclick", operation(cm, function(e) {
	        if (signalDOMEvent(cm, e)) return;
	        var pos = posFromMouse(cm, e);
	        if (!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e)) return;
	        e_preventDefault(e);
	        var word = cm.findWordAt(pos);
	        extendSelection(cm.doc, word.anchor, word.head);
	      }));
	    else
	      on(d.scroller, "dblclick", function(e) { signalDOMEvent(cm, e) || e_preventDefault(e); });
	    // Some browsers fire contextmenu *after* opening the menu, at
	    // which point we can't mess with it anymore. Context menu is
	    // handled in onMouseDown for these browsers.
	    if (!captureRightClick) on(d.scroller, "contextmenu", function(e) {onContextMenu(cm, e);});

	    // Used to suppress mouse event handling when a touch happens
	    var touchFinished, prevTouch = {end: 0};
	    function finishTouch() {
	      if (d.activeTouch) {
	        touchFinished = setTimeout(function() {d.activeTouch = null;}, 1000);
	        prevTouch = d.activeTouch;
	        prevTouch.end = +new Date;
	      }
	    };
	    function isMouseLikeTouchEvent(e) {
	      if (e.touches.length != 1) return false;
	      var touch = e.touches[0];
	      return touch.radiusX <= 1 && touch.radiusY <= 1;
	    }
	    function farAway(touch, other) {
	      if (other.left == null) return true;
	      var dx = other.left - touch.left, dy = other.top - touch.top;
	      return dx * dx + dy * dy > 20 * 20;
	    }
	    on(d.scroller, "touchstart", function(e) {
	      if (!signalDOMEvent(cm, e) && !isMouseLikeTouchEvent(e)) {
	        clearTimeout(touchFinished);
	        var now = +new Date;
	        d.activeTouch = {start: now, moved: false,
	                         prev: now - prevTouch.end <= 300 ? prevTouch : null};
	        if (e.touches.length == 1) {
	          d.activeTouch.left = e.touches[0].pageX;
	          d.activeTouch.top = e.touches[0].pageY;
	        }
	      }
	    });
	    on(d.scroller, "touchmove", function() {
	      if (d.activeTouch) d.activeTouch.moved = true;
	    });
	    on(d.scroller, "touchend", function(e) {
	      var touch = d.activeTouch;
	      if (touch && !eventInWidget(d, e) && touch.left != null &&
	          !touch.moved && new Date - touch.start < 300) {
	        var pos = cm.coordsChar(d.activeTouch, "page"), range;
	        if (!touch.prev || farAway(touch, touch.prev)) // Single tap
	          range = new Range(pos, pos);
	        else if (!touch.prev.prev || farAway(touch, touch.prev.prev)) // Double tap
	          range = cm.findWordAt(pos);
	        else // Triple tap
	          range = new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0)));
	        cm.setSelection(range.anchor, range.head);
	        cm.focus();
	        e_preventDefault(e);
	      }
	      finishTouch();
	    });
	    on(d.scroller, "touchcancel", finishTouch);

	    // Sync scrolling between fake scrollbars and real scrollable
	    // area, ensure viewport is updated when scrolling.
	    on(d.scroller, "scroll", function() {
	      if (d.scroller.clientHeight) {
	        setScrollTop(cm, d.scroller.scrollTop);
	        setScrollLeft(cm, d.scroller.scrollLeft, true);
	        signal(cm, "scroll", cm);
	      }
	    });

	    // Listen to wheel events in order to try and update the viewport on time.
	    on(d.scroller, "mousewheel", function(e){onScrollWheel(cm, e);});
	    on(d.scroller, "DOMMouseScroll", function(e){onScrollWheel(cm, e);});

	    // Prevent wrapper from ever scrolling
	    on(d.wrapper, "scroll", function() { d.wrapper.scrollTop = d.wrapper.scrollLeft = 0; });

	    d.dragFunctions = {
	      enter: function(e) {if (!signalDOMEvent(cm, e)) e_stop(e);},
	      over: function(e) {if (!signalDOMEvent(cm, e)) { onDragOver(cm, e); e_stop(e); }},
	      start: function(e){onDragStart(cm, e);},
	      drop: operation(cm, onDrop),
	      leave: function(e) {if (!signalDOMEvent(cm, e)) { clearDragCursor(cm); }}
	    };

	    var inp = d.input.getField();
	    on(inp, "keyup", function(e) { onKeyUp.call(cm, e); });
	    on(inp, "keydown", operation(cm, onKeyDown));
	    on(inp, "keypress", operation(cm, onKeyPress));
	    on(inp, "focus", bind(onFocus, cm));
	    on(inp, "blur", bind(onBlur, cm));
	  }

	  function dragDropChanged(cm, value, old) {
	    var wasOn = old && old != CodeMirror.Init;
	    if (!value != !wasOn) {
	      var funcs = cm.display.dragFunctions;
	      var toggle = value ? on : off;
	      toggle(cm.display.scroller, "dragstart", funcs.start);
	      toggle(cm.display.scroller, "dragenter", funcs.enter);
	      toggle(cm.display.scroller, "dragover", funcs.over);
	      toggle(cm.display.scroller, "dragleave", funcs.leave);
	      toggle(cm.display.scroller, "drop", funcs.drop);
	    }
	  }

	  // Called when the window resizes
	  function onResize(cm) {
	    var d = cm.display;
	    if (d.lastWrapHeight == d.wrapper.clientHeight && d.lastWrapWidth == d.wrapper.clientWidth)
	      return;
	    // Might be a text scaling operation, clear size caches.
	    d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
	    d.scrollbarsClipped = false;
	    cm.setSize();
	  }

	  // MOUSE EVENTS

	  // Return true when the given mouse event happened in a widget
	  function eventInWidget(display, e) {
	    for (var n = e_target(e); n != display.wrapper; n = n.parentNode) {
	      if (!n || (n.nodeType == 1 && n.getAttribute("cm-ignore-events") == "true") ||
	          (n.parentNode == display.sizer && n != display.mover))
	        return true;
	    }
	  }

	  // Given a mouse event, find the corresponding position. If liberal
	  // is false, it checks whether a gutter or scrollbar was clicked,
	  // and returns null if it was. forRect is used by rectangular
	  // selections, and tries to estimate a character position even for
	  // coordinates beyond the right of the text.
	  function posFromMouse(cm, e, liberal, forRect) {
	    var display = cm.display;
	    if (!liberal && e_target(e).getAttribute("cm-not-content") == "true") return null;

	    var x, y, space = display.lineSpace.getBoundingClientRect();
	    // Fails unpredictably on IE[67] when mouse is dragged around quickly.
	    try { x = e.clientX - space.left; y = e.clientY - space.top; }
	    catch (e) { return null; }
	    var coords = coordsChar(cm, x, y), line;
	    if (forRect && coords.xRel == 1 && (line = getLine(cm.doc, coords.line).text).length == coords.ch) {
	      var colDiff = countColumn(line, line.length, cm.options.tabSize) - line.length;
	      coords = Pos(coords.line, Math.max(0, Math.round((x - paddingH(cm.display).left) / charWidth(cm.display)) - colDiff));
	    }
	    return coords;
	  }

	  // A mouse down can be a single click, double click, triple click,
	  // start of selection drag, start of text drag, new cursor
	  // (ctrl-click), rectangle drag (alt-drag), or xwin
	  // middle-click-paste. Or it might be a click on something we should
	  // not interfere with, such as a scrollbar or widget.
	  function onMouseDown(e) {
	    var cm = this, display = cm.display;
	    if (signalDOMEvent(cm, e) || display.activeTouch && display.input.supportsTouch()) return;
	    display.shift = e.shiftKey;

	    if (eventInWidget(display, e)) {
	      if (!webkit) {
	        // Briefly turn off draggability, to allow widgets to do
	        // normal dragging things.
	        display.scroller.draggable = false;
	        setTimeout(function(){display.scroller.draggable = true;}, 100);
	      }
	      return;
	    }
	    if (clickInGutter(cm, e)) return;
	    var start = posFromMouse(cm, e);
	    window.focus();

	    switch (e_button(e)) {
	    case 1:
	      // #3261: make sure, that we're not starting a second selection
	      if (cm.state.selectingText)
	        cm.state.selectingText(e);
	      else if (start)
	        leftButtonDown(cm, e, start);
	      else if (e_target(e) == display.scroller)
	        e_preventDefault(e);
	      break;
	    case 2:
	      if (webkit) cm.state.lastMiddleDown = +new Date;
	      if (start) extendSelection(cm.doc, start);
	      setTimeout(function() {display.input.focus();}, 20);
	      e_preventDefault(e);
	      break;
	    case 3:
	      if (captureRightClick) onContextMenu(cm, e);
	      else delayBlurEvent(cm);
	      break;
	    }
	  }

	  var lastClick, lastDoubleClick;
	  function leftButtonDown(cm, e, start) {
	    if (ie) setTimeout(bind(ensureFocus, cm), 0);
	    else cm.curOp.focus = activeElt();

	    var now = +new Date, type;
	    if (lastDoubleClick && lastDoubleClick.time > now - 400 && cmp(lastDoubleClick.pos, start) == 0) {
	      type = "triple";
	    } else if (lastClick && lastClick.time > now - 400 && cmp(lastClick.pos, start) == 0) {
	      type = "double";
	      lastDoubleClick = {time: now, pos: start};
	    } else {
	      type = "single";
	      lastClick = {time: now, pos: start};
	    }

	    var sel = cm.doc.sel, modifier = mac ? e.metaKey : e.ctrlKey, contained;
	    if (cm.options.dragDrop && dragAndDrop && !cm.isReadOnly() &&
	        type == "single" && (contained = sel.contains(start)) > -1 &&
	        (cmp((contained = sel.ranges[contained]).from(), start) < 0 || start.xRel > 0) &&
	        (cmp(contained.to(), start) > 0 || start.xRel < 0))
	      leftButtonStartDrag(cm, e, start, modifier);
	    else
	      leftButtonSelect(cm, e, start, type, modifier);
	  }

	  // Start a text drag. When it ends, see if any dragging actually
	  // happen, and treat as a click if it didn't.
	  function leftButtonStartDrag(cm, e, start, modifier) {
	    var display = cm.display, startTime = +new Date;
	    var dragEnd = operation(cm, function(e2) {
	      if (webkit) display.scroller.draggable = false;
	      cm.state.draggingText = false;
	      off(document, "mouseup", dragEnd);
	      off(display.scroller, "drop", dragEnd);
	      if (Math.abs(e.clientX - e2.clientX) + Math.abs(e.clientY - e2.clientY) < 10) {
	        e_preventDefault(e2);
	        if (!modifier && +new Date - 200 < startTime)
	          extendSelection(cm.doc, start);
	        // Work around unexplainable focus problem in IE9 (#2127) and Chrome (#3081)
	        if (webkit || ie && ie_version == 9)
	          setTimeout(function() {document.body.focus(); display.input.focus();}, 20);
	        else
	          display.input.focus();
	      }
	    });
	    // Let the drag handler handle this.
	    if (webkit) display.scroller.draggable = true;
	    cm.state.draggingText = dragEnd;
	    dragEnd.copy = mac ? e.altKey : e.ctrlKey
	    // IE's approach to draggable
	    if (display.scroller.dragDrop) display.scroller.dragDrop();
	    on(document, "mouseup", dragEnd);
	    on(display.scroller, "drop", dragEnd);
	  }

	  // Normal selection, as opposed to text dragging.
	  function leftButtonSelect(cm, e, start, type, addNew) {
	    var display = cm.display, doc = cm.doc;
	    e_preventDefault(e);

	    var ourRange, ourIndex, startSel = doc.sel, ranges = startSel.ranges;
	    if (addNew && !e.shiftKey) {
	      ourIndex = doc.sel.contains(start);
	      if (ourIndex > -1)
	        ourRange = ranges[ourIndex];
	      else
	        ourRange = new Range(start, start);
	    } else {
	      ourRange = doc.sel.primary();
	      ourIndex = doc.sel.primIndex;
	    }

	    if (chromeOS ? e.shiftKey && e.metaKey : e.altKey) {
	      type = "rect";
	      if (!addNew) ourRange = new Range(start, start);
	      start = posFromMouse(cm, e, true, true);
	      ourIndex = -1;
	    } else if (type == "double") {
	      var word = cm.findWordAt(start);
	      if (cm.display.shift || doc.extend)
	        ourRange = extendRange(doc, ourRange, word.anchor, word.head);
	      else
	        ourRange = word;
	    } else if (type == "triple") {
	      var line = new Range(Pos(start.line, 0), clipPos(doc, Pos(start.line + 1, 0)));
	      if (cm.display.shift || doc.extend)
	        ourRange = extendRange(doc, ourRange, line.anchor, line.head);
	      else
	        ourRange = line;
	    } else {
	      ourRange = extendRange(doc, ourRange, start);
	    }

	    if (!addNew) {
	      ourIndex = 0;
	      setSelection(doc, new Selection([ourRange], 0), sel_mouse);
	      startSel = doc.sel;
	    } else if (ourIndex == -1) {
	      ourIndex = ranges.length;
	      setSelection(doc, normalizeSelection(ranges.concat([ourRange]), ourIndex),
	                   {scroll: false, origin: "*mouse"});
	    } else if (ranges.length > 1 && ranges[ourIndex].empty() && type == "single" && !e.shiftKey) {
	      setSelection(doc, normalizeSelection(ranges.slice(0, ourIndex).concat(ranges.slice(ourIndex + 1)), 0),
	                   {scroll: false, origin: "*mouse"});
	      startSel = doc.sel;
	    } else {
	      replaceOneSelection(doc, ourIndex, ourRange, sel_mouse);
	    }

	    var lastPos = start;
	    function extendTo(pos) {
	      if (cmp(lastPos, pos) == 0) return;
	      lastPos = pos;

	      if (type == "rect") {
	        var ranges = [], tabSize = cm.options.tabSize;
	        var startCol = countColumn(getLine(doc, start.line).text, start.ch, tabSize);
	        var posCol = countColumn(getLine(doc, pos.line).text, pos.ch, tabSize);
	        var left = Math.min(startCol, posCol), right = Math.max(startCol, posCol);
	        for (var line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line));
	             line <= end; line++) {
	          var text = getLine(doc, line).text, leftPos = findColumn(text, left, tabSize);
	          if (left == right)
	            ranges.push(new Range(Pos(line, leftPos), Pos(line, leftPos)));
	          else if (text.length > leftPos)
	            ranges.push(new Range(Pos(line, leftPos), Pos(line, findColumn(text, right, tabSize))));
	        }
	        if (!ranges.length) ranges.push(new Range(start, start));
	        setSelection(doc, normalizeSelection(startSel.ranges.slice(0, ourIndex).concat(ranges), ourIndex),
	                     {origin: "*mouse", scroll: false});
	        cm.scrollIntoView(pos);
	      } else {
	        var oldRange = ourRange;
	        var anchor = oldRange.anchor, head = pos;
	        if (type != "single") {
	          if (type == "double")
	            var range = cm.findWordAt(pos);
	          else
	            var range = new Range(Pos(pos.line, 0), clipPos(doc, Pos(pos.line + 1, 0)));
	          if (cmp(range.anchor, anchor) > 0) {
	            head = range.head;
	            anchor = minPos(oldRange.from(), range.anchor);
	          } else {
	            head = range.anchor;
	            anchor = maxPos(oldRange.to(), range.head);
	          }
	        }
	        var ranges = startSel.ranges.slice(0);
	        ranges[ourIndex] = new Range(clipPos(doc, anchor), head);
	        setSelection(doc, normalizeSelection(ranges, ourIndex), sel_mouse);
	      }
	    }

	    var editorSize = display.wrapper.getBoundingClientRect();
	    // Used to ensure timeout re-tries don't fire when another extend
	    // happened in the meantime (clearTimeout isn't reliable -- at
	    // least on Chrome, the timeouts still happen even when cleared,
	    // if the clear happens after their scheduled firing time).
	    var counter = 0;

	    function extend(e) {
	      var curCount = ++counter;
	      var cur = posFromMouse(cm, e, true, type == "rect");
	      if (!cur) return;
	      if (cmp(cur, lastPos) != 0) {
	        cm.curOp.focus = activeElt();
	        extendTo(cur);
	        var visible = visibleLines(display, doc);
	        if (cur.line >= visible.to || cur.line < visible.from)
	          setTimeout(operation(cm, function(){if (counter == curCount) extend(e);}), 150);
	      } else {
	        var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
	        if (outside) setTimeout(operation(cm, function() {
	          if (counter != curCount) return;
	          display.scroller.scrollTop += outside;
	          extend(e);
	        }), 50);
	      }
	    }

	    function done(e) {
	      cm.state.selectingText = false;
	      counter = Infinity;
	      e_preventDefault(e);
	      display.input.focus();
	      off(document, "mousemove", move);
	      off(document, "mouseup", up);
	      doc.history.lastSelOrigin = null;
	    }

	    var move = operation(cm, function(e) {
	      if (!e_button(e)) done(e);
	      else extend(e);
	    });
	    var up = operation(cm, done);
	    cm.state.selectingText = up;
	    on(document, "mousemove", move);
	    on(document, "mouseup", up);
	  }

	  // Determines whether an event happened in the gutter, and fires the
	  // handlers for the corresponding event.
	  function gutterEvent(cm, e, type, prevent) {
	    try { var mX = e.clientX, mY = e.clientY; }
	    catch(e) { return false; }
	    if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right)) return false;
	    if (prevent) e_preventDefault(e);

	    var display = cm.display;
	    var lineBox = display.lineDiv.getBoundingClientRect();

	    if (mY > lineBox.bottom || !hasHandler(cm, type)) return e_defaultPrevented(e);
	    mY -= lineBox.top - display.viewOffset;

	    for (var i = 0; i < cm.options.gutters.length; ++i) {
	      var g = display.gutters.childNodes[i];
	      if (g && g.getBoundingClientRect().right >= mX) {
	        var line = lineAtHeight(cm.doc, mY);
	        var gutter = cm.options.gutters[i];
	        signal(cm, type, cm, line, gutter, e);
	        return e_defaultPrevented(e);
	      }
	    }
	  }

	  function clickInGutter(cm, e) {
	    return gutterEvent(cm, e, "gutterClick", true);
	  }

	  // Kludge to work around strange IE behavior where it'll sometimes
	  // re-fire a series of drag-related events right after the drop (#1551)
	  var lastDrop = 0;

	  function onDrop(e) {
	    var cm = this;
	    clearDragCursor(cm);
	    if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e))
	      return;
	    e_preventDefault(e);
	    if (ie) lastDrop = +new Date;
	    var pos = posFromMouse(cm, e, true), files = e.dataTransfer.files;
	    if (!pos || cm.isReadOnly()) return;
	    // Might be a file drop, in which case we simply extract the text
	    // and insert it.
	    if (files && files.length && window.FileReader && window.File) {
	      var n = files.length, text = Array(n), read = 0;
	      var loadFile = function(file, i) {
	        if (cm.options.allowDropFileTypes &&
	            indexOf(cm.options.allowDropFileTypes, file.type) == -1)
	          return;

	        var reader = new FileReader;
	        reader.onload = operation(cm, function() {
	          var content = reader.result;
	          if (/[\x00-\x08\x0e-\x1f]{2}/.test(content)) content = "";
	          text[i] = content;
	          if (++read == n) {
	            pos = clipPos(cm.doc, pos);
	            var change = {from: pos, to: pos,
	                          text: cm.doc.splitLines(text.join(cm.doc.lineSeparator())),
	                          origin: "paste"};
	            makeChange(cm.doc, change);
	            setSelectionReplaceHistory(cm.doc, simpleSelection(pos, changeEnd(change)));
	          }
	        });
	        reader.readAsText(file);
	      };
	      for (var i = 0; i < n; ++i) loadFile(files[i], i);
	    } else { // Normal drop
	      // Don't do a replace if the drop happened inside of the selected text.
	      if (cm.state.draggingText && cm.doc.sel.contains(pos) > -1) {
	        cm.state.draggingText(e);
	        // Ensure the editor is re-focused
	        setTimeout(function() {cm.display.input.focus();}, 20);
	        return;
	      }
	      try {
	        var text = e.dataTransfer.getData("Text");
	        if (text) {
	          if (cm.state.draggingText && !cm.state.draggingText.copy)
	            var selected = cm.listSelections();
	          setSelectionNoUndo(cm.doc, simpleSelection(pos, pos));
	          if (selected) for (var i = 0; i < selected.length; ++i)
	            replaceRange(cm.doc, "", selected[i].anchor, selected[i].head, "drag");
	          cm.replaceSelection(text, "around", "paste");
	          cm.display.input.focus();
	        }
	      }
	      catch(e){}
	    }
	  }

	  function onDragStart(cm, e) {
	    if (ie && (!cm.state.draggingText || +new Date - lastDrop < 100)) { e_stop(e); return; }
	    if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) return;

	    e.dataTransfer.setData("Text", cm.getSelection());
	    e.dataTransfer.effectAllowed = "copyMove"

	    // Use dummy image instead of default browsers image.
	    // Recent Safari (~6.0.2) have a tendency to segfault when this happens, so we don't do it there.
	    if (e.dataTransfer.setDragImage && !safari) {
	      var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
	      img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
	      if (presto) {
	        img.width = img.height = 1;
	        cm.display.wrapper.appendChild(img);
	        // Force a relayout, or Opera won't use our image for some obscure reason
	        img._top = img.offsetTop;
	      }
	      e.dataTransfer.setDragImage(img, 0, 0);
	      if (presto) img.parentNode.removeChild(img);
	    }
	  }

	  function onDragOver(cm, e) {
	    var pos = posFromMouse(cm, e);
	    if (!pos) return;
	    var frag = document.createDocumentFragment();
	    drawSelectionCursor(cm, pos, frag);
	    if (!cm.display.dragCursor) {
	      cm.display.dragCursor = elt("div", null, "CodeMirror-cursors CodeMirror-dragcursors");
	      cm.display.lineSpace.insertBefore(cm.display.dragCursor, cm.display.cursorDiv);
	    }
	    removeChildrenAndAdd(cm.display.dragCursor, frag);
	  }

	  function clearDragCursor(cm) {
	    if (cm.display.dragCursor) {
	      cm.display.lineSpace.removeChild(cm.display.dragCursor);
	      cm.display.dragCursor = null;
	    }
	  }

	  // SCROLL EVENTS

	  // Sync the scrollable area and scrollbars, ensure the viewport
	  // covers the visible area.
	  function setScrollTop(cm, val) {
	    if (Math.abs(cm.doc.scrollTop - val) < 2) return;
	    cm.doc.scrollTop = val;
	    if (!gecko) updateDisplaySimple(cm, {top: val});
	    if (cm.display.scroller.scrollTop != val) cm.display.scroller.scrollTop = val;
	    cm.display.scrollbars.setScrollTop(val);
	    if (gecko) updateDisplaySimple(cm);
	    startWorker(cm, 100);
	  }
	  // Sync scroller and scrollbar, ensure the gutter elements are
	  // aligned.
	  function setScrollLeft(cm, val, isScroller) {
	    if (isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) return;
	    val = Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth);
	    cm.doc.scrollLeft = val;
	    alignHorizontally(cm);
	    if (cm.display.scroller.scrollLeft != val) cm.display.scroller.scrollLeft = val;
	    cm.display.scrollbars.setScrollLeft(val);
	  }

	  // Since the delta values reported on mouse wheel events are
	  // unstandardized between browsers and even browser versions, and
	  // generally horribly unpredictable, this code starts by measuring
	  // the scroll effect that the first few mouse wheel events have,
	  // and, from that, detects the way it can convert deltas to pixel
	  // offsets afterwards.
	  //
	  // The reason we want to know the amount a wheel event will scroll
	  // is that it gives us a chance to update the display before the
	  // actual scrolling happens, reducing flickering.

	  var wheelSamples = 0, wheelPixelsPerUnit = null;
	  // Fill in a browser-detected starting value on browsers where we
	  // know one. These don't have to be accurate -- the result of them
	  // being wrong would just be a slight flicker on the first wheel
	  // scroll (if it is large enough).
	  if (ie) wheelPixelsPerUnit = -.53;
	  else if (gecko) wheelPixelsPerUnit = 15;
	  else if (chrome) wheelPixelsPerUnit = -.7;
	  else if (safari) wheelPixelsPerUnit = -1/3;

	  var wheelEventDelta = function(e) {
	    var dx = e.wheelDeltaX, dy = e.wheelDeltaY;
	    if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) dx = e.detail;
	    if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) dy = e.detail;
	    else if (dy == null) dy = e.wheelDelta;
	    return {x: dx, y: dy};
	  };
	  CodeMirror.wheelEventPixels = function(e) {
	    var delta = wheelEventDelta(e);
	    delta.x *= wheelPixelsPerUnit;
	    delta.y *= wheelPixelsPerUnit;
	    return delta;
	  };

	  function onScrollWheel(cm, e) {
	    var delta = wheelEventDelta(e), dx = delta.x, dy = delta.y;

	    var display = cm.display, scroll = display.scroller;
	    // Quit if there's nothing to scroll here
	    var canScrollX = scroll.scrollWidth > scroll.clientWidth;
	    var canScrollY = scroll.scrollHeight > scroll.clientHeight;
	    if (!(dx && canScrollX || dy && canScrollY)) return;

	    // Webkit browsers on OS X abort momentum scrolls when the target
	    // of the scroll event is removed from the scrollable element.
	    // This hack (see related code in patchDisplay) makes sure the
	    // element is kept around.
	    if (dy && mac && webkit) {
	      outer: for (var cur = e.target, view = display.view; cur != scroll; cur = cur.parentNode) {
	        for (var i = 0; i < view.length; i++) {
	          if (view[i].node == cur) {
	            cm.display.currentWheelTarget = cur;
	            break outer;
	          }
	        }
	      }
	    }

	    // On some browsers, horizontal scrolling will cause redraws to
	    // happen before the gutter has been realigned, causing it to
	    // wriggle around in a most unseemly way. When we have an
	    // estimated pixels/delta value, we just handle horizontal
	    // scrolling entirely here. It'll be slightly off from native, but
	    // better than glitching out.
	    if (dx && !gecko && !presto && wheelPixelsPerUnit != null) {
	      if (dy && canScrollY)
	        setScrollTop(cm, Math.max(0, Math.min(scroll.scrollTop + dy * wheelPixelsPerUnit, scroll.scrollHeight - scroll.clientHeight)));
	      setScrollLeft(cm, Math.max(0, Math.min(scroll.scrollLeft + dx * wheelPixelsPerUnit, scroll.scrollWidth - scroll.clientWidth)));
	      // Only prevent default scrolling if vertical scrolling is
	      // actually possible. Otherwise, it causes vertical scroll
	      // jitter on OSX trackpads when deltaX is small and deltaY
	      // is large (issue #3579)
	      if (!dy || (dy && canScrollY))
	        e_preventDefault(e);
	      display.wheelStartX = null; // Abort measurement, if in progress
	      return;
	    }

	    // 'Project' the visible viewport to cover the area that is being
	    // scrolled into view (if we know enough to estimate it).
	    if (dy && wheelPixelsPerUnit != null) {
	      var pixels = dy * wheelPixelsPerUnit;
	      var top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
	      if (pixels < 0) top = Math.max(0, top + pixels - 50);
	      else bot = Math.min(cm.doc.height, bot + pixels + 50);
	      updateDisplaySimple(cm, {top: top, bottom: bot});
	    }

	    if (wheelSamples < 20) {
	      if (display.wheelStartX == null) {
	        display.wheelStartX = scroll.scrollLeft; display.wheelStartY = scroll.scrollTop;
	        display.wheelDX = dx; display.wheelDY = dy;
	        setTimeout(function() {
	          if (display.wheelStartX == null) return;
	          var movedX = scroll.scrollLeft - display.wheelStartX;
	          var movedY = scroll.scrollTop - display.wheelStartY;
	          var sample = (movedY && display.wheelDY && movedY / display.wheelDY) ||
	            (movedX && display.wheelDX && movedX / display.wheelDX);
	          display.wheelStartX = display.wheelStartY = null;
	          if (!sample) return;
	          wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
	          ++wheelSamples;
	        }, 200);
	      } else {
	        display.wheelDX += dx; display.wheelDY += dy;
	      }
	    }
	  }

	  // KEY EVENTS

	  // Run a handler that was bound to a key.
	  function doHandleBinding(cm, bound, dropShift) {
	    if (typeof bound == "string") {
	      bound = commands[bound];
	      if (!bound) return false;
	    }
	    // Ensure previous input has been read, so that the handler sees a
	    // consistent view of the document
	    cm.display.input.ensurePolled();
	    var prevShift = cm.display.shift, done = false;
	    try {
	      if (cm.isReadOnly()) cm.state.suppressEdits = true;
	      if (dropShift) cm.display.shift = false;
	      done = bound(cm) != Pass;
	    } finally {
	      cm.display.shift = prevShift;
	      cm.state.suppressEdits = false;
	    }
	    return done;
	  }

	  function lookupKeyForEditor(cm, name, handle) {
	    for (var i = 0; i < cm.state.keyMaps.length; i++) {
	      var result = lookupKey(name, cm.state.keyMaps[i], handle, cm);
	      if (result) return result;
	    }
	    return (cm.options.extraKeys && lookupKey(name, cm.options.extraKeys, handle, cm))
	      || lookupKey(name, cm.options.keyMap, handle, cm);
	  }

	  var stopSeq = new Delayed;
	  function dispatchKey(cm, name, e, handle) {
	    var seq = cm.state.keySeq;
	    if (seq) {
	      if (isModifierKey(name)) return "handled";
	      stopSeq.set(50, function() {
	        if (cm.state.keySeq == seq) {
	          cm.state.keySeq = null;
	          cm.display.input.reset();
	        }
	      });
	      name = seq + " " + name;
	    }
	    var result = lookupKeyForEditor(cm, name, handle);

	    if (result == "multi")
	      cm.state.keySeq = name;
	    if (result == "handled")
	      signalLater(cm, "keyHandled", cm, name, e);

	    if (result == "handled" || result == "multi") {
	      e_preventDefault(e);
	      restartBlink(cm);
	    }

	    if (seq && !result && /\'$/.test(name)) {
	      e_preventDefault(e);
	      return true;
	    }
	    return !!result;
	  }

	  // Handle a key from the keydown event.
	  function handleKeyBinding(cm, e) {
	    var name = keyName(e, true);
	    if (!name) return false;

	    if (e.shiftKey && !cm.state.keySeq) {
	      // First try to resolve full name (including 'Shift-'). Failing
	      // that, see if there is a cursor-motion command (starting with
	      // 'go') bound to the keyname without 'Shift-'.
	      return dispatchKey(cm, "Shift-" + name, e, function(b) {return doHandleBinding(cm, b, true);})
	          || dispatchKey(cm, name, e, function(b) {
	               if (typeof b == "string" ? /^go[A-Z]/.test(b) : b.motion)
	                 return doHandleBinding(cm, b);
	             });
	    } else {
	      return dispatchKey(cm, name, e, function(b) { return doHandleBinding(cm, b); });
	    }
	  }

	  // Handle a key from the keypress event
	  function handleCharBinding(cm, e, ch) {
	    return dispatchKey(cm, "'" + ch + "'", e,
	                       function(b) { return doHandleBinding(cm, b, true); });
	  }

	  var lastStoppedKey = null;
	  function onKeyDown(e) {
	    var cm = this;
	    cm.curOp.focus = activeElt();
	    if (signalDOMEvent(cm, e)) return;
	    // IE does strange things with escape.
	    if (ie && ie_version < 11 && e.keyCode == 27) e.returnValue = false;
	    var code = e.keyCode;
	    cm.display.shift = code == 16 || e.shiftKey;
	    var handled = handleKeyBinding(cm, e);
	    if (presto) {
	      lastStoppedKey = handled ? code : null;
	      // Opera has no cut event... we try to at least catch the key combo
	      if (!handled && code == 88 && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey))
	        cm.replaceSelection("", null, "cut");
	    }

	    // Turn mouse into crosshair when Alt is held on Mac.
	    if (code == 18 && !/\bCodeMirror-crosshair\b/.test(cm.display.lineDiv.className))
	      showCrossHair(cm);
	  }

	  function showCrossHair(cm) {
	    var lineDiv = cm.display.lineDiv;
	    addClass(lineDiv, "CodeMirror-crosshair");

	    function up(e) {
	      if (e.keyCode == 18 || !e.altKey) {
	        rmClass(lineDiv, "CodeMirror-crosshair");
	        off(document, "keyup", up);
	        off(document, "mouseover", up);
	      }
	    }
	    on(document, "keyup", up);
	    on(document, "mouseover", up);
	  }

	  function onKeyUp(e) {
	    if (e.keyCode == 16) this.doc.sel.shift = false;
	    signalDOMEvent(this, e);
	  }

	  function onKeyPress(e) {
	    var cm = this;
	    if (eventInWidget(cm.display, e) || signalDOMEvent(cm, e) || e.ctrlKey && !e.altKey || mac && e.metaKey) return;
	    var keyCode = e.keyCode, charCode = e.charCode;
	    if (presto && keyCode == lastStoppedKey) {lastStoppedKey = null; e_preventDefault(e); return;}
	    if ((presto && (!e.which || e.which < 10)) && handleKeyBinding(cm, e)) return;
	    var ch = String.fromCharCode(charCode == null ? keyCode : charCode);
	    if (handleCharBinding(cm, e, ch)) return;
	    cm.display.input.onKeyPress(e);
	  }

	  // FOCUS/BLUR EVENTS

	  function delayBlurEvent(cm) {
	    cm.state.delayingBlurEvent = true;
	    setTimeout(function() {
	      if (cm.state.delayingBlurEvent) {
	        cm.state.delayingBlurEvent = false;
	        onBlur(cm);
	      }
	    }, 100);
	  }

	  function onFocus(cm) {
	    if (cm.state.delayingBlurEvent) cm.state.delayingBlurEvent = false;

	    if (cm.options.readOnly == "nocursor") return;
	    if (!cm.state.focused) {
	      signal(cm, "focus", cm);
	      cm.state.focused = true;
	      addClass(cm.display.wrapper, "CodeMirror-focused");
	      // This test prevents this from firing when a context
	      // menu is closed (since the input reset would kill the
	      // select-all detection hack)
	      if (!cm.curOp && cm.display.selForContextMenu != cm.doc.sel) {
	        cm.display.input.reset();
	        if (webkit) setTimeout(function() { cm.display.input.reset(true); }, 20); // Issue #1730
	      }
	      cm.display.input.receivedFocus();
	    }
	    restartBlink(cm);
	  }
	  function onBlur(cm) {
	    if (cm.state.delayingBlurEvent) return;

	    if (cm.state.focused) {
	      signal(cm, "blur", cm);
	      cm.state.focused = false;
	      rmClass(cm.display.wrapper, "CodeMirror-focused");
	    }
	    clearInterval(cm.display.blinker);
	    setTimeout(function() {if (!cm.state.focused) cm.display.shift = false;}, 150);
	  }

	  // CONTEXT MENU HANDLING

	  // To make the context menu work, we need to briefly unhide the
	  // textarea (making it as unobtrusive as possible) to let the
	  // right-click take effect on it.
	  function onContextMenu(cm, e) {
	    if (eventInWidget(cm.display, e) || contextMenuInGutter(cm, e)) return;
	    if (signalDOMEvent(cm, e, "contextmenu")) return;
	    cm.display.input.onContextMenu(e);
	  }

	  function contextMenuInGutter(cm, e) {
	    if (!hasHandler(cm, "gutterContextMenu")) return false;
	    return gutterEvent(cm, e, "gutterContextMenu", false);
	  }

	  // UPDATING

	  // Compute the position of the end of a change (its 'to' property
	  // refers to the pre-change end).
	  var changeEnd = CodeMirror.changeEnd = function(change) {
	    if (!change.text) return change.to;
	    return Pos(change.from.line + change.text.length - 1,
	               lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0));
	  };

	  // Adjust a position to refer to the post-change position of the
	  // same text, or the end of the change if the change covers it.
	  function adjustForChange(pos, change) {
	    if (cmp(pos, change.from) < 0) return pos;
	    if (cmp(pos, change.to) <= 0) return changeEnd(change);

	    var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
	    if (pos.line == change.to.line) ch += changeEnd(change).ch - change.to.ch;
	    return Pos(line, ch);
	  }

	  function computeSelAfterChange(doc, change) {
	    var out = [];
	    for (var i = 0; i < doc.sel.ranges.length; i++) {
	      var range = doc.sel.ranges[i];
	      out.push(new Range(adjustForChange(range.anchor, change),
	                         adjustForChange(range.head, change)));
	    }
	    return normalizeSelection(out, doc.sel.primIndex);
	  }

	  function offsetPos(pos, old, nw) {
	    if (pos.line == old.line)
	      return Pos(nw.line, pos.ch - old.ch + nw.ch);
	    else
	      return Pos(nw.line + (pos.line - old.line), pos.ch);
	  }

	  // Used by replaceSelections to allow moving the selection to the
	  // start or around the replaced test. Hint may be "start" or "around".
	  function computeReplacedSel(doc, changes, hint) {
	    var out = [];
	    var oldPrev = Pos(doc.first, 0), newPrev = oldPrev;
	    for (var i = 0; i < changes.length; i++) {
	      var change = changes[i];
	      var from = offsetPos(change.from, oldPrev, newPrev);
	      var to = offsetPos(changeEnd(change), oldPrev, newPrev);
	      oldPrev = change.to;
	      newPrev = to;
	      if (hint == "around") {
	        var range = doc.sel.ranges[i], inv = cmp(range.head, range.anchor) < 0;
	        out[i] = new Range(inv ? to : from, inv ? from : to);
	      } else {
	        out[i] = new Range(from, from);
	      }
	    }
	    return new Selection(out, doc.sel.primIndex);
	  }

	  // Allow "beforeChange" event handlers to influence a change
	  function filterChange(doc, change, update) {
	    var obj = {
	      canceled: false,
	      from: change.from,
	      to: change.to,
	      text: change.text,
	      origin: change.origin,
	      cancel: function() { this.canceled = true; }
	    };
	    if (update) obj.update = function(from, to, text, origin) {
	      if (from) this.from = clipPos(doc, from);
	      if (to) this.to = clipPos(doc, to);
	      if (text) this.text = text;
	      if (origin !== undefined) this.origin = origin;
	    };
	    signal(doc, "beforeChange", doc, obj);
	    if (doc.cm) signal(doc.cm, "beforeChange", doc.cm, obj);

	    if (obj.canceled) return null;
	    return {from: obj.from, to: obj.to, text: obj.text, origin: obj.origin};
	  }

	  // Apply a change to a document, and add it to the document's
	  // history, and propagating it to all linked documents.
	  function makeChange(doc, change, ignoreReadOnly) {
	    if (doc.cm) {
	      if (!doc.cm.curOp) return operation(doc.cm, makeChange)(doc, change, ignoreReadOnly);
	      if (doc.cm.state.suppressEdits) return;
	    }

	    if (hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange")) {
	      change = filterChange(doc, change, true);
	      if (!change) return;
	    }

	    // Possibly split or suppress the update based on the presence
	    // of read-only spans in its range.
	    var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc, change.from, change.to);
	    if (split) {
	      for (var i = split.length - 1; i >= 0; --i)
	        makeChangeInner(doc, {from: split[i].from, to: split[i].to, text: i ? [""] : change.text});
	    } else {
	      makeChangeInner(doc, change);
	    }
	  }

	  function makeChangeInner(doc, change) {
	    if (change.text.length == 1 && change.text[0] == "" && cmp(change.from, change.to) == 0) return;
	    var selAfter = computeSelAfterChange(doc, change);
	    addChangeToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);

	    makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));
	    var rebased = [];

	    linkedDocs(doc, function(doc, sharedHist) {
	      if (!sharedHist && indexOf(rebased, doc.history) == -1) {
	        rebaseHist(doc.history, change);
	        rebased.push(doc.history);
	      }
	      makeChangeSingleDoc(doc, change, null, stretchSpansOverChange(doc, change));
	    });
	  }

	  // Revert a change stored in a document's history.
	  function makeChangeFromHistory(doc, type, allowSelectionOnly) {
	    if (doc.cm && doc.cm.state.suppressEdits && !allowSelectionOnly) return;

	    var hist = doc.history, event, selAfter = doc.sel;
	    var source = type == "undo" ? hist.done : hist.undone, dest = type == "undo" ? hist.undone : hist.done;

	    // Verify that there is a useable event (so that ctrl-z won't
	    // needlessly clear selection events)
	    for (var i = 0; i < source.length; i++) {
	      event = source[i];
	      if (allowSelectionOnly ? event.ranges && !event.equals(doc.sel) : !event.ranges)
	        break;
	    }
	    if (i == source.length) return;
	    hist.lastOrigin = hist.lastSelOrigin = null;

	    for (;;) {
	      event = source.pop();
	      if (event.ranges) {
	        pushSelectionToHistory(event, dest);
	        if (allowSelectionOnly && !event.equals(doc.sel)) {
	          setSelection(doc, event, {clearRedo: false});
	          return;
	        }
	        selAfter = event;
	      }
	      else break;
	    }

	    // Build up a reverse change object to add to the opposite history
	    // stack (redo when undoing, and vice versa).
	    var antiChanges = [];
	    pushSelectionToHistory(selAfter, dest);
	    dest.push({changes: antiChanges, generation: hist.generation});
	    hist.generation = event.generation || ++hist.maxGeneration;

	    var filter = hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange");

	    for (var i = event.changes.length - 1; i >= 0; --i) {
	      var change = event.changes[i];
	      change.origin = type;
	      if (filter && !filterChange(doc, change, false)) {
	        source.length = 0;
	        return;
	      }

	      antiChanges.push(historyChangeFromChange(doc, change));

	      var after = i ? computeSelAfterChange(doc, change) : lst(source);
	      makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change));
	      if (!i && doc.cm) doc.cm.scrollIntoView({from: change.from, to: changeEnd(change)});
	      var rebased = [];

	      // Propagate to the linked documents
	      linkedDocs(doc, function(doc, sharedHist) {
	        if (!sharedHist && indexOf(rebased, doc.history) == -1) {
	          rebaseHist(doc.history, change);
	          rebased.push(doc.history);
	        }
	        makeChangeSingleDoc(doc, change, null, mergeOldSpans(doc, change));
	      });
	    }
	  }

	  // Sub-views need their line numbers shifted when text is added
	  // above or below them in the parent document.
	  function shiftDoc(doc, distance) {
	    if (distance == 0) return;
	    doc.first += distance;
	    doc.sel = new Selection(map(doc.sel.ranges, function(range) {
	      return new Range(Pos(range.anchor.line + distance, range.anchor.ch),
	                       Pos(range.head.line + distance, range.head.ch));
	    }), doc.sel.primIndex);
	    if (doc.cm) {
	      regChange(doc.cm, doc.first, doc.first - distance, distance);
	      for (var d = doc.cm.display, l = d.viewFrom; l < d.viewTo; l++)
	        regLineChange(doc.cm, l, "gutter");
	    }
	  }

	  // More lower-level change function, handling only a single document
	  // (not linked ones).
	  function makeChangeSingleDoc(doc, change, selAfter, spans) {
	    if (doc.cm && !doc.cm.curOp)
	      return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);

	    if (change.to.line < doc.first) {
	      shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
	      return;
	    }
	    if (change.from.line > doc.lastLine()) return;

	    // Clip the change to the size of this doc
	    if (change.from.line < doc.first) {
	      var shift = change.text.length - 1 - (doc.first - change.from.line);
	      shiftDoc(doc, shift);
	      change = {from: Pos(doc.first, 0), to: Pos(change.to.line + shift, change.to.ch),
	                text: [lst(change.text)], origin: change.origin};
	    }
	    var last = doc.lastLine();
	    if (change.to.line > last) {
	      change = {from: change.from, to: Pos(last, getLine(doc, last).text.length),
	                text: [change.text[0]], origin: change.origin};
	    }

	    change.removed = getBetween(doc, change.from, change.to);

	    if (!selAfter) selAfter = computeSelAfterChange(doc, change);
	    if (doc.cm) makeChangeSingleDocInEditor(doc.cm, change, spans);
	    else updateDoc(doc, change, spans);
	    setSelectionNoUndo(doc, selAfter, sel_dontScroll);
	  }

	  // Handle the interaction of a change to a document with the editor
	  // that this document is part of.
	  function makeChangeSingleDocInEditor(cm, change, spans) {
	    var doc = cm.doc, display = cm.display, from = change.from, to = change.to;

	    var recomputeMaxLength = false, checkWidthStart = from.line;
	    if (!cm.options.lineWrapping) {
	      checkWidthStart = lineNo(visualLine(getLine(doc, from.line)));
	      doc.iter(checkWidthStart, to.line + 1, function(line) {
	        if (line == display.maxLine) {
	          recomputeMaxLength = true;
	          return true;
	        }
	      });
	    }

	    if (doc.sel.contains(change.from, change.to) > -1)
	      signalCursorActivity(cm);

	    updateDoc(doc, change, spans, estimateHeight(cm));

	    if (!cm.options.lineWrapping) {
	      doc.iter(checkWidthStart, from.line + change.text.length, function(line) {
	        var len = lineLength(line);
	        if (len > display.maxLineLength) {
	          display.maxLine = line;
	          display.maxLineLength = len;
	          display.maxLineChanged = true;
	          recomputeMaxLength = false;
	        }
	      });
	      if (recomputeMaxLength) cm.curOp.updateMaxLine = true;
	    }

	    // Adjust frontier, schedule worker
	    doc.frontier = Math.min(doc.frontier, from.line);
	    startWorker(cm, 400);

	    var lendiff = change.text.length - (to.line - from.line) - 1;
	    // Remember that these lines changed, for updating the display
	    if (change.full)
	      regChange(cm);
	    else if (from.line == to.line && change.text.length == 1 && !isWholeLineUpdate(cm.doc, change))
	      regLineChange(cm, from.line, "text");
	    else
	      regChange(cm, from.line, to.line + 1, lendiff);

	    var changesHandler = hasHandler(cm, "changes"), changeHandler = hasHandler(cm, "change");
	    if (changeHandler || changesHandler) {
	      var obj = {
	        from: from, to: to,
	        text: change.text,
	        removed: change.removed,
	        origin: change.origin
	      };
	      if (changeHandler) signalLater(cm, "change", cm, obj);
	      if (changesHandler) (cm.curOp.changeObjs || (cm.curOp.changeObjs = [])).push(obj);
	    }
	    cm.display.selForContextMenu = null;
	  }

	  function replaceRange(doc, code, from, to, origin) {
	    if (!to) to = from;
	    if (cmp(to, from) < 0) { var tmp = to; to = from; from = tmp; }
	    if (typeof code == "string") code = doc.splitLines(code);
	    makeChange(doc, {from: from, to: to, text: code, origin: origin});
	  }

	  // SCROLLING THINGS INTO VIEW

	  // If an editor sits on the top or bottom of the window, partially
	  // scrolled out of view, this ensures that the cursor is visible.
	  function maybeScrollWindow(cm, coords) {
	    if (signalDOMEvent(cm, "scrollCursorIntoView")) return;

	    var display = cm.display, box = display.sizer.getBoundingClientRect(), doScroll = null;
	    if (coords.top + box.top < 0) doScroll = true;
	    else if (coords.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight)) doScroll = false;
	    if (doScroll != null && !phantom) {
	      var scrollNode = elt("div", "\u200b", null, "position: absolute; top: " +
	                           (coords.top - display.viewOffset - paddingTop(cm.display)) + "px; height: " +
	                           (coords.bottom - coords.top + scrollGap(cm) + display.barHeight) + "px; left: " +
	                           coords.left + "px; width: 2px;");
	      cm.display.lineSpace.appendChild(scrollNode);
	      scrollNode.scrollIntoView(doScroll);
	      cm.display.lineSpace.removeChild(scrollNode);
	    }
	  }

	  // Scroll a given position into view (immediately), verifying that
	  // it actually became visible (as line heights are accurately
	  // measured, the position of something may 'drift' during drawing).
	  function scrollPosIntoView(cm, pos, end, margin) {
	    if (margin == null) margin = 0;
	    for (var limit = 0; limit < 5; limit++) {
	      var changed = false, coords = cursorCoords(cm, pos);
	      var endCoords = !end || end == pos ? coords : cursorCoords(cm, end);
	      var scrollPos = calculateScrollPos(cm, Math.min(coords.left, endCoords.left),
	                                         Math.min(coords.top, endCoords.top) - margin,
	                                         Math.max(coords.left, endCoords.left),
	                                         Math.max(coords.bottom, endCoords.bottom) + margin);
	      var startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
	      if (scrollPos.scrollTop != null) {
	        setScrollTop(cm, scrollPos.scrollTop);
	        if (Math.abs(cm.doc.scrollTop - startTop) > 1) changed = true;
	      }
	      if (scrollPos.scrollLeft != null) {
	        setScrollLeft(cm, scrollPos.scrollLeft);
	        if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) changed = true;
	      }
	      if (!changed) break;
	    }
	    return coords;
	  }

	  // Scroll a given set of coordinates into view (immediately).
	  function scrollIntoView(cm, x1, y1, x2, y2) {
	    var scrollPos = calculateScrollPos(cm, x1, y1, x2, y2);
	    if (scrollPos.scrollTop != null) setScrollTop(cm, scrollPos.scrollTop);
	    if (scrollPos.scrollLeft != null) setScrollLeft(cm, scrollPos.scrollLeft);
	  }

	  // Calculate a new scroll position needed to scroll the given
	  // rectangle into view. Returns an object with scrollTop and
	  // scrollLeft properties. When these are undefined, the
	  // vertical/horizontal position does not need to be adjusted.
	  function calculateScrollPos(cm, x1, y1, x2, y2) {
	    var display = cm.display, snapMargin = textHeight(cm.display);
	    if (y1 < 0) y1 = 0;
	    var screentop = cm.curOp && cm.curOp.scrollTop != null ? cm.curOp.scrollTop : display.scroller.scrollTop;
	    var screen = displayHeight(cm), result = {};
	    if (y2 - y1 > screen) y2 = y1 + screen;
	    var docBottom = cm.doc.height + paddingVert(display);
	    var atTop = y1 < snapMargin, atBottom = y2 > docBottom - snapMargin;
	    if (y1 < screentop) {
	      result.scrollTop = atTop ? 0 : y1;
	    } else if (y2 > screentop + screen) {
	      var newTop = Math.min(y1, (atBottom ? docBottom : y2) - screen);
	      if (newTop != screentop) result.scrollTop = newTop;
	    }

	    var screenleft = cm.curOp && cm.curOp.scrollLeft != null ? cm.curOp.scrollLeft : display.scroller.scrollLeft;
	    var screenw = displayWidth(cm) - (cm.options.fixedGutter ? display.gutters.offsetWidth : 0);
	    var tooWide = x2 - x1 > screenw;
	    if (tooWide) x2 = x1 + screenw;
	    if (x1 < 10)
	      result.scrollLeft = 0;
	    else if (x1 < screenleft)
	      result.scrollLeft = Math.max(0, x1 - (tooWide ? 0 : 10));
	    else if (x2 > screenw + screenleft - 3)
	      result.scrollLeft = x2 + (tooWide ? 0 : 10) - screenw;
	    return result;
	  }

	  // Store a relative adjustment to the scroll position in the current
	  // operation (to be applied when the operation finishes).
	  function addToScrollPos(cm, left, top) {
	    if (left != null || top != null) resolveScrollToPos(cm);
	    if (left != null)
	      cm.curOp.scrollLeft = (cm.curOp.scrollLeft == null ? cm.doc.scrollLeft : cm.curOp.scrollLeft) + left;
	    if (top != null)
	      cm.curOp.scrollTop = (cm.curOp.scrollTop == null ? cm.doc.scrollTop : cm.curOp.scrollTop) + top;
	  }

	  // Make sure that at the end of the operation the current cursor is
	  // shown.
	  function ensureCursorVisible(cm) {
	    resolveScrollToPos(cm);
	    var cur = cm.getCursor(), from = cur, to = cur;
	    if (!cm.options.lineWrapping) {
	      from = cur.ch ? Pos(cur.line, cur.ch - 1) : cur;
	      to = Pos(cur.line, cur.ch + 1);
	    }
	    cm.curOp.scrollToPos = {from: from, to: to, margin: cm.options.cursorScrollMargin, isCursor: true};
	  }

	  // When an operation has its scrollToPos property set, and another
	  // scroll action is applied before the end of the operation, this
	  // 'simulates' scrolling that position into view in a cheap way, so
	  // that the effect of intermediate scroll commands is not ignored.
	  function resolveScrollToPos(cm) {
	    var range = cm.curOp.scrollToPos;
	    if (range) {
	      cm.curOp.scrollToPos = null;
	      var from = estimateCoords(cm, range.from), to = estimateCoords(cm, range.to);
	      var sPos = calculateScrollPos(cm, Math.min(from.left, to.left),
	                                    Math.min(from.top, to.top) - range.margin,
	                                    Math.max(from.right, to.right),
	                                    Math.max(from.bottom, to.bottom) + range.margin);
	      cm.scrollTo(sPos.scrollLeft, sPos.scrollTop);
	    }
	  }

	  // API UTILITIES

	  // Indent the given line. The how parameter can be "smart",
	  // "add"/null, "subtract", or "prev". When aggressive is false
	  // (typically set to true for forced single-line indents), empty
	  // lines are not indented, and places where the mode returns Pass
	  // are left alone.
	  function indentLine(cm, n, how, aggressive) {
	    var doc = cm.doc, state;
	    if (how == null) how = "add";
	    if (how == "smart") {
	      // Fall back to "prev" when the mode doesn't have an indentation
	      // method.
	      if (!doc.mode.indent) how = "prev";
	      else state = getStateBefore(cm, n);
	    }

	    var tabSize = cm.options.tabSize;
	    var line = getLine(doc, n), curSpace = countColumn(line.text, null, tabSize);
	    if (line.stateAfter) line.stateAfter = null;
	    var curSpaceString = line.text.match(/^\s*/)[0], indentation;
	    if (!aggressive && !/\S/.test(line.text)) {
	      indentation = 0;
	      how = "not";
	    } else if (how == "smart") {
	      indentation = doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
	      if (indentation == Pass || indentation > 150) {
	        if (!aggressive) return;
	        how = "prev";
	      }
	    }
	    if (how == "prev") {
	      if (n > doc.first) indentation = countColumn(getLine(doc, n-1).text, null, tabSize);
	      else indentation = 0;
	    } else if (how == "add") {
	      indentation = curSpace + cm.options.indentUnit;
	    } else if (how == "subtract") {
	      indentation = curSpace - cm.options.indentUnit;
	    } else if (typeof how == "number") {
	      indentation = curSpace + how;
	    }
	    indentation = Math.max(0, indentation);

	    var indentString = "", pos = 0;
	    if (cm.options.indentWithTabs)
	      for (var i = Math.floor(indentation / tabSize); i; --i) {pos += tabSize; indentString += "\t";}
	    if (pos < indentation) indentString += spaceStr(indentation - pos);

	    if (indentString != curSpaceString) {
	      replaceRange(doc, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input");
	      line.stateAfter = null;
	      return true;
	    } else {
	      // Ensure that, if the cursor was in the whitespace at the start
	      // of the line, it is moved to the end of that space.
	      for (var i = 0; i < doc.sel.ranges.length; i++) {
	        var range = doc.sel.ranges[i];
	        if (range.head.line == n && range.head.ch < curSpaceString.length) {
	          var pos = Pos(n, curSpaceString.length);
	          replaceOneSelection(doc, i, new Range(pos, pos));
	          break;
	        }
	      }
	    }
	  }

	  // Utility for applying a change to a line by handle or number,
	  // returning the number and optionally registering the line as
	  // changed.
	  function changeLine(doc, handle, changeType, op) {
	    var no = handle, line = handle;
	    if (typeof handle == "number") line = getLine(doc, clipLine(doc, handle));
	    else no = lineNo(handle);
	    if (no == null) return null;
	    if (op(line, no) && doc.cm) regLineChange(doc.cm, no, changeType);
	    return line;
	  }

	  // Helper for deleting text near the selection(s), used to implement
	  // backspace, delete, and similar functionality.
	  function deleteNearSelection(cm, compute) {
	    var ranges = cm.doc.sel.ranges, kill = [];
	    // Build up a set of ranges to kill first, merging overlapping
	    // ranges.
	    for (var i = 0; i < ranges.length; i++) {
	      var toKill = compute(ranges[i]);
	      while (kill.length && cmp(toKill.from, lst(kill).to) <= 0) {
	        var replaced = kill.pop();
	        if (cmp(replaced.from, toKill.from) < 0) {
	          toKill.from = replaced.from;
	          break;
	        }
	      }
	      kill.push(toKill);
	    }
	    // Next, remove those actual ranges.
	    runInOp(cm, function() {
	      for (var i = kill.length - 1; i >= 0; i--)
	        replaceRange(cm.doc, "", kill[i].from, kill[i].to, "+delete");
	      ensureCursorVisible(cm);
	    });
	  }

	  // Used for horizontal relative motion. Dir is -1 or 1 (left or
	  // right), unit can be "char", "column" (like char, but doesn't
	  // cross line boundaries), "word" (across next word), or "group" (to
	  // the start of next group of word or non-word-non-whitespace
	  // chars). The visually param controls whether, in right-to-left
	  // text, direction 1 means to move towards the next index in the
	  // string, or towards the character to the right of the current
	  // position. The resulting position will have a hitSide=true
	  // property if it reached the end of the document.
	  function findPosH(doc, pos, dir, unit, visually) {
	    var line = pos.line, ch = pos.ch, origDir = dir;
	    var lineObj = getLine(doc, line);
	    function findNextLine() {
	      var l = line + dir;
	      if (l < doc.first || l >= doc.first + doc.size) return false
	      line = l;
	      return lineObj = getLine(doc, l);
	    }
	    function moveOnce(boundToLine) {
	      var next = (visually ? moveVisually : moveLogically)(lineObj, ch, dir, true);
	      if (next == null) {
	        if (!boundToLine && findNextLine()) {
	          if (visually) ch = (dir < 0 ? lineRight : lineLeft)(lineObj);
	          else ch = dir < 0 ? lineObj.text.length : 0;
	        } else return false
	      } else ch = next;
	      return true;
	    }

	    if (unit == "char") {
	      moveOnce()
	    } else if (unit == "column") {
	      moveOnce(true)
	    } else if (unit == "word" || unit == "group") {
	      var sawType = null, group = unit == "group";
	      var helper = doc.cm && doc.cm.getHelper(pos, "wordChars");
	      for (var first = true;; first = false) {
	        if (dir < 0 && !moveOnce(!first)) break;
	        var cur = lineObj.text.charAt(ch) || "\n";
	        var type = isWordChar(cur, helper) ? "w"
	          : group && cur == "\n" ? "n"
	          : !group || /\s/.test(cur) ? null
	          : "p";
	        if (group && !first && !type) type = "s";
	        if (sawType && sawType != type) {
	          if (dir < 0) {dir = 1; moveOnce();}
	          break;
	        }

	        if (type) sawType = type;
	        if (dir > 0 && !moveOnce(!first)) break;
	      }
	    }
	    var result = skipAtomic(doc, Pos(line, ch), pos, origDir, true);
	    if (!cmp(pos, result)) result.hitSide = true;
	    return result;
	  }

	  // For relative vertical movement. Dir may be -1 or 1. Unit can be
	  // "page" or "line". The resulting position will have a hitSide=true
	  // property if it reached the end of the document.
	  function findPosV(cm, pos, dir, unit) {
	    var doc = cm.doc, x = pos.left, y;
	    if (unit == "page") {
	      var pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
	      y = pos.top + dir * (pageSize - (dir < 0 ? 1.5 : .5) * textHeight(cm.display));
	    } else if (unit == "line") {
	      y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
	    }
	    for (;;) {
	      var target = coordsChar(cm, x, y);
	      if (!target.outside) break;
	      if (dir < 0 ? y <= 0 : y >= doc.height) { target.hitSide = true; break; }
	      y += dir * 5;
	    }
	    return target;
	  }

	  // EDITOR METHODS

	  // The publicly visible API. Note that methodOp(f) means
	  // 'wrap f in an operation, performed on its `this` parameter'.

	  // This is not the complete set of editor methods. Most of the
	  // methods defined on the Doc type are also injected into
	  // CodeMirror.prototype, for backwards compatibility and
	  // convenience.

	  CodeMirror.prototype = {
	    constructor: CodeMirror,
	    focus: function(){window.focus(); this.display.input.focus();},

	    setOption: function(option, value) {
	      var options = this.options, old = options[option];
	      if (options[option] == value && option != "mode") return;
	      options[option] = value;
	      if (optionHandlers.hasOwnProperty(option))
	        operation(this, optionHandlers[option])(this, value, old);
	    },

	    getOption: function(option) {return this.options[option];},
	    getDoc: function() {return this.doc;},

	    addKeyMap: function(map, bottom) {
	      this.state.keyMaps[bottom ? "push" : "unshift"](getKeyMap(map));
	    },
	    removeKeyMap: function(map) {
	      var maps = this.state.keyMaps;
	      for (var i = 0; i < maps.length; ++i)
	        if (maps[i] == map || maps[i].name == map) {
	          maps.splice(i, 1);
	          return true;
	        }
	    },

	    addOverlay: methodOp(function(spec, options) {
	      var mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
	      if (mode.startState) throw new Error("Overlays may not be stateful.");
	      insertSorted(this.state.overlays,
	                   {mode: mode, modeSpec: spec, opaque: options && options.opaque,
	                    priority: (options && options.priority) || 0},
	                   function(overlay) { return overlay.priority })
	      this.state.modeGen++;
	      regChange(this);
	    }),
	    removeOverlay: methodOp(function(spec) {
	      var overlays = this.state.overlays;
	      for (var i = 0; i < overlays.length; ++i) {
	        var cur = overlays[i].modeSpec;
	        if (cur == spec || typeof spec == "string" && cur.name == spec) {
	          overlays.splice(i, 1);
	          this.state.modeGen++;
	          regChange(this);
	          return;
	        }
	      }
	    }),

	    indentLine: methodOp(function(n, dir, aggressive) {
	      if (typeof dir != "string" && typeof dir != "number") {
	        if (dir == null) dir = this.options.smartIndent ? "smart" : "prev";
	        else dir = dir ? "add" : "subtract";
	      }
	      if (isLine(this.doc, n)) indentLine(this, n, dir, aggressive);
	    }),
	    indentSelection: methodOp(function(how) {
	      var ranges = this.doc.sel.ranges, end = -1;
	      for (var i = 0; i < ranges.length; i++) {
	        var range = ranges[i];
	        if (!range.empty()) {
	          var from = range.from(), to = range.to();
	          var start = Math.max(end, from.line);
	          end = Math.min(this.lastLine(), to.line - (to.ch ? 0 : 1)) + 1;
	          for (var j = start; j < end; ++j)
	            indentLine(this, j, how);
	          var newRanges = this.doc.sel.ranges;
	          if (from.ch == 0 && ranges.length == newRanges.length && newRanges[i].from().ch > 0)
	            replaceOneSelection(this.doc, i, new Range(from, newRanges[i].to()), sel_dontScroll);
	        } else if (range.head.line > end) {
	          indentLine(this, range.head.line, how, true);
	          end = range.head.line;
	          if (i == this.doc.sel.primIndex) ensureCursorVisible(this);
	        }
	      }
	    }),

	    // Fetch the parser token for a given character. Useful for hacks
	    // that want to inspect the mode state (say, for completion).
	    getTokenAt: function(pos, precise) {
	      return takeToken(this, pos, precise);
	    },

	    getLineTokens: function(line, precise) {
	      return takeToken(this, Pos(line), precise, true);
	    },

	    getTokenTypeAt: function(pos) {
	      pos = clipPos(this.doc, pos);
	      var styles = getLineStyles(this, getLine(this.doc, pos.line));
	      var before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
	      var type;
	      if (ch == 0) type = styles[2];
	      else for (;;) {
	        var mid = (before + after) >> 1;
	        if ((mid ? styles[mid * 2 - 1] : 0) >= ch) after = mid;
	        else if (styles[mid * 2 + 1] < ch) before = mid + 1;
	        else { type = styles[mid * 2 + 2]; break; }
	      }
	      var cut = type ? type.indexOf("cm-overlay ") : -1;
	      return cut < 0 ? type : cut == 0 ? null : type.slice(0, cut - 1);
	    },

	    getModeAt: function(pos) {
	      var mode = this.doc.mode;
	      if (!mode.innerMode) return mode;
	      return CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode;
	    },

	    getHelper: function(pos, type) {
	      return this.getHelpers(pos, type)[0];
	    },

	    getHelpers: function(pos, type) {
	      var found = [];
	      if (!helpers.hasOwnProperty(type)) return found;
	      var help = helpers[type], mode = this.getModeAt(pos);
	      if (typeof mode[type] == "string") {
	        if (help[mode[type]]) found.push(help[mode[type]]);
	      } else if (mode[type]) {
	        for (var i = 0; i < mode[type].length; i++) {
	          var val = help[mode[type][i]];
	          if (val) found.push(val);
	        }
	      } else if (mode.helperType && help[mode.helperType]) {
	        found.push(help[mode.helperType]);
	      } else if (help[mode.name]) {
	        found.push(help[mode.name]);
	      }
	      for (var i = 0; i < help._global.length; i++) {
	        var cur = help._global[i];
	        if (cur.pred(mode, this) && indexOf(found, cur.val) == -1)
	          found.push(cur.val);
	      }
	      return found;
	    },

	    getStateAfter: function(line, precise) {
	      var doc = this.doc;
	      line = clipLine(doc, line == null ? doc.first + doc.size - 1: line);
	      return getStateBefore(this, line + 1, precise);
	    },

	    cursorCoords: function(start, mode) {
	      var pos, range = this.doc.sel.primary();
	      if (start == null) pos = range.head;
	      else if (typeof start == "object") pos = clipPos(this.doc, start);
	      else pos = start ? range.from() : range.to();
	      return cursorCoords(this, pos, mode || "page");
	    },

	    charCoords: function(pos, mode) {
	      return charCoords(this, clipPos(this.doc, pos), mode || "page");
	    },

	    coordsChar: function(coords, mode) {
	      coords = fromCoordSystem(this, coords, mode || "page");
	      return coordsChar(this, coords.left, coords.top);
	    },

	    lineAtHeight: function(height, mode) {
	      height = fromCoordSystem(this, {top: height, left: 0}, mode || "page").top;
	      return lineAtHeight(this.doc, height + this.display.viewOffset);
	    },
	    heightAtLine: function(line, mode) {
	      var end = false, lineObj;
	      if (typeof line == "number") {
	        var last = this.doc.first + this.doc.size - 1;
	        if (line < this.doc.first) line = this.doc.first;
	        else if (line > last) { line = last; end = true; }
	        lineObj = getLine(this.doc, line);
	      } else {
	        lineObj = line;
	      }
	      return intoCoordSystem(this, lineObj, {top: 0, left: 0}, mode || "page").top +
	        (end ? this.doc.height - heightAtLine(lineObj) : 0);
	    },

	    defaultTextHeight: function() { return textHeight(this.display); },
	    defaultCharWidth: function() { return charWidth(this.display); },

	    setGutterMarker: methodOp(function(line, gutterID, value) {
	      return changeLine(this.doc, line, "gutter", function(line) {
	        var markers = line.gutterMarkers || (line.gutterMarkers = {});
	        markers[gutterID] = value;
	        if (!value && isEmpty(markers)) line.gutterMarkers = null;
	        return true;
	      });
	    }),

	    clearGutter: methodOp(function(gutterID) {
	      var cm = this, doc = cm.doc, i = doc.first;
	      doc.iter(function(line) {
	        if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
	          line.gutterMarkers[gutterID] = null;
	          regLineChange(cm, i, "gutter");
	          if (isEmpty(line.gutterMarkers)) line.gutterMarkers = null;
	        }
	        ++i;
	      });
	    }),

	    lineInfo: function(line) {
	      if (typeof line == "number") {
	        if (!isLine(this.doc, line)) return null;
	        var n = line;
	        line = getLine(this.doc, line);
	        if (!line) return null;
	      } else {
	        var n = lineNo(line);
	        if (n == null) return null;
	      }
	      return {line: n, handle: line, text: line.text, gutterMarkers: line.gutterMarkers,
	              textClass: line.textClass, bgClass: line.bgClass, wrapClass: line.wrapClass,
	              widgets: line.widgets};
	    },

	    getViewport: function() { return {from: this.display.viewFrom, to: this.display.viewTo};},

	    addWidget: function(pos, node, scroll, vert, horiz) {
	      var display = this.display;
	      pos = cursorCoords(this, clipPos(this.doc, pos));
	      var top = pos.bottom, left = pos.left;
	      node.style.position = "absolute";
	      node.setAttribute("cm-ignore-events", "true");
	      this.display.input.setUneditable(node);
	      display.sizer.appendChild(node);
	      if (vert == "over") {
	        top = pos.top;
	      } else if (vert == "above" || vert == "near") {
	        var vspace = Math.max(display.wrapper.clientHeight, this.doc.height),
	        hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
	        // Default to positioning above (if specified and possible); otherwise default to positioning below
	        if ((vert == 'above' || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight)
	          top = pos.top - node.offsetHeight;
	        else if (pos.bottom + node.offsetHeight <= vspace)
	          top = pos.bottom;
	        if (left + node.offsetWidth > hspace)
	          left = hspace - node.offsetWidth;
	      }
	      node.style.top = top + "px";
	      node.style.left = node.style.right = "";
	      if (horiz == "right") {
	        left = display.sizer.clientWidth - node.offsetWidth;
	        node.style.right = "0px";
	      } else {
	        if (horiz == "left") left = 0;
	        else if (horiz == "middle") left = (display.sizer.clientWidth - node.offsetWidth) / 2;
	        node.style.left = left + "px";
	      }
	      if (scroll)
	        scrollIntoView(this, left, top, left + node.offsetWidth, top + node.offsetHeight);
	    },

	    triggerOnKeyDown: methodOp(onKeyDown),
	    triggerOnKeyPress: methodOp(onKeyPress),
	    triggerOnKeyUp: onKeyUp,

	    execCommand: function(cmd) {
	      if (commands.hasOwnProperty(cmd))
	        return commands[cmd].call(null, this);
	    },

	    triggerElectric: methodOp(function(text) { triggerElectric(this, text); }),

	    findPosH: function(from, amount, unit, visually) {
	      var dir = 1;
	      if (amount < 0) { dir = -1; amount = -amount; }
	      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
	        cur = findPosH(this.doc, cur, dir, unit, visually);
	        if (cur.hitSide) break;
	      }
	      return cur;
	    },

	    moveH: methodOp(function(dir, unit) {
	      var cm = this;
	      cm.extendSelectionsBy(function(range) {
	        if (cm.display.shift || cm.doc.extend || range.empty())
	          return findPosH(cm.doc, range.head, dir, unit, cm.options.rtlMoveVisually);
	        else
	          return dir < 0 ? range.from() : range.to();
	      }, sel_move);
	    }),

	    deleteH: methodOp(function(dir, unit) {
	      var sel = this.doc.sel, doc = this.doc;
	      if (sel.somethingSelected())
	        doc.replaceSelection("", null, "+delete");
	      else
	        deleteNearSelection(this, function(range) {
	          var other = findPosH(doc, range.head, dir, unit, false);
	          return dir < 0 ? {from: other, to: range.head} : {from: range.head, to: other};
	        });
	    }),

	    findPosV: function(from, amount, unit, goalColumn) {
	      var dir = 1, x = goalColumn;
	      if (amount < 0) { dir = -1; amount = -amount; }
	      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
	        var coords = cursorCoords(this, cur, "div");
	        if (x == null) x = coords.left;
	        else coords.left = x;
	        cur = findPosV(this, coords, dir, unit);
	        if (cur.hitSide) break;
	      }
	      return cur;
	    },

	    moveV: methodOp(function(dir, unit) {
	      var cm = this, doc = this.doc, goals = [];
	      var collapse = !cm.display.shift && !doc.extend && doc.sel.somethingSelected();
	      doc.extendSelectionsBy(function(range) {
	        if (collapse)
	          return dir < 0 ? range.from() : range.to();
	        var headPos = cursorCoords(cm, range.head, "div");
	        if (range.goalColumn != null) headPos.left = range.goalColumn;
	        goals.push(headPos.left);
	        var pos = findPosV(cm, headPos, dir, unit);
	        if (unit == "page" && range == doc.sel.primary())
	          addToScrollPos(cm, null, charCoords(cm, pos, "div").top - headPos.top);
	        return pos;
	      }, sel_move);
	      if (goals.length) for (var i = 0; i < doc.sel.ranges.length; i++)
	        doc.sel.ranges[i].goalColumn = goals[i];
	    }),

	    // Find the word at the given position (as returned by coordsChar).
	    findWordAt: function(pos) {
	      var doc = this.doc, line = getLine(doc, pos.line).text;
	      var start = pos.ch, end = pos.ch;
	      if (line) {
	        var helper = this.getHelper(pos, "wordChars");
	        if ((pos.xRel < 0 || end == line.length) && start) --start; else ++end;
	        var startChar = line.charAt(start);
	        var check = isWordChar(startChar, helper)
	          ? function(ch) { return isWordChar(ch, helper); }
	          : /\s/.test(startChar) ? function(ch) {return /\s/.test(ch);}
	          : function(ch) {return !/\s/.test(ch) && !isWordChar(ch);};
	        while (start > 0 && check(line.charAt(start - 1))) --start;
	        while (end < line.length && check(line.charAt(end))) ++end;
	      }
	      return new Range(Pos(pos.line, start), Pos(pos.line, end));
	    },

	    toggleOverwrite: function(value) {
	      if (value != null && value == this.state.overwrite) return;
	      if (this.state.overwrite = !this.state.overwrite)
	        addClass(this.display.cursorDiv, "CodeMirror-overwrite");
	      else
	        rmClass(this.display.cursorDiv, "CodeMirror-overwrite");

	      signal(this, "overwriteToggle", this, this.state.overwrite);
	    },
	    hasFocus: function() { return this.display.input.getField() == activeElt(); },
	    isReadOnly: function() { return !!(this.options.readOnly || this.doc.cantEdit); },

	    scrollTo: methodOp(function(x, y) {
	      if (x != null || y != null) resolveScrollToPos(this);
	      if (x != null) this.curOp.scrollLeft = x;
	      if (y != null) this.curOp.scrollTop = y;
	    }),
	    getScrollInfo: function() {
	      var scroller = this.display.scroller;
	      return {left: scroller.scrollLeft, top: scroller.scrollTop,
	              height: scroller.scrollHeight - scrollGap(this) - this.display.barHeight,
	              width: scroller.scrollWidth - scrollGap(this) - this.display.barWidth,
	              clientHeight: displayHeight(this), clientWidth: displayWidth(this)};
	    },

	    scrollIntoView: methodOp(function(range, margin) {
	      if (range == null) {
	        range = {from: this.doc.sel.primary().head, to: null};
	        if (margin == null) margin = this.options.cursorScrollMargin;
	      } else if (typeof range == "number") {
	        range = {from: Pos(range, 0), to: null};
	      } else if (range.from == null) {
	        range = {from: range, to: null};
	      }
	      if (!range.to) range.to = range.from;
	      range.margin = margin || 0;

	      if (range.from.line != null) {
	        resolveScrollToPos(this);
	        this.curOp.scrollToPos = range;
	      } else {
	        var sPos = calculateScrollPos(this, Math.min(range.from.left, range.to.left),
	                                      Math.min(range.from.top, range.to.top) - range.margin,
	                                      Math.max(range.from.right, range.to.right),
	                                      Math.max(range.from.bottom, range.to.bottom) + range.margin);
	        this.scrollTo(sPos.scrollLeft, sPos.scrollTop);
	      }
	    }),

	    setSize: methodOp(function(width, height) {
	      var cm = this;
	      function interpret(val) {
	        return typeof val == "number" || /^\d+$/.test(String(val)) ? val + "px" : val;
	      }
	      if (width != null) cm.display.wrapper.style.width = interpret(width);
	      if (height != null) cm.display.wrapper.style.height = interpret(height);
	      if (cm.options.lineWrapping) clearLineMeasurementCache(this);
	      var lineNo = cm.display.viewFrom;
	      cm.doc.iter(lineNo, cm.display.viewTo, function(line) {
	        if (line.widgets) for (var i = 0; i < line.widgets.length; i++)
	          if (line.widgets[i].noHScroll) { regLineChange(cm, lineNo, "widget"); break; }
	        ++lineNo;
	      });
	      cm.curOp.forceUpdate = true;
	      signal(cm, "refresh", this);
	    }),

	    operation: function(f){return runInOp(this, f);},

	    refresh: methodOp(function() {
	      var oldHeight = this.display.cachedTextHeight;
	      regChange(this);
	      this.curOp.forceUpdate = true;
	      clearCaches(this);
	      this.scrollTo(this.doc.scrollLeft, this.doc.scrollTop);
	      updateGutterSpace(this);
	      if (oldHeight == null || Math.abs(oldHeight - textHeight(this.display)) > .5)
	        estimateLineHeights(this);
	      signal(this, "refresh", this);
	    }),

	    swapDoc: methodOp(function(doc) {
	      var old = this.doc;
	      old.cm = null;
	      attachDoc(this, doc);
	      clearCaches(this);
	      this.display.input.reset();
	      this.scrollTo(doc.scrollLeft, doc.scrollTop);
	      this.curOp.forceScroll = true;
	      signalLater(this, "swapDoc", this, old);
	      return old;
	    }),

	    getInputField: function(){return this.display.input.getField();},
	    getWrapperElement: function(){return this.display.wrapper;},
	    getScrollerElement: function(){return this.display.scroller;},
	    getGutterElement: function(){return this.display.gutters;}
	  };
	  eventMixin(CodeMirror);

	  // OPTION DEFAULTS

	  // The default configuration options.
	  var defaults = CodeMirror.defaults = {};
	  // Functions to run when options are changed.
	  var optionHandlers = CodeMirror.optionHandlers = {};

	  function option(name, deflt, handle, notOnInit) {
	    CodeMirror.defaults[name] = deflt;
	    if (handle) optionHandlers[name] =
	      notOnInit ? function(cm, val, old) {if (old != Init) handle(cm, val, old);} : handle;
	  }

	  // Passed to option handlers when there is no old value.
	  var Init = CodeMirror.Init = {toString: function(){return "CodeMirror.Init";}};

	  // These two are, on init, called from the constructor because they
	  // have to be initialized before the editor can start at all.
	  option("value", "", function(cm, val) {
	    cm.setValue(val);
	  }, true);
	  option("mode", null, function(cm, val) {
	    cm.doc.modeOption = val;
	    loadMode(cm);
	  }, true);

	  option("indentUnit", 2, loadMode, true);
	  option("indentWithTabs", false);
	  option("smartIndent", true);
	  option("tabSize", 4, function(cm) {
	    resetModeState(cm);
	    clearCaches(cm);
	    regChange(cm);
	  }, true);
	  option("lineSeparator", null, function(cm, val) {
	    cm.doc.lineSep = val;
	    if (!val) return;
	    var newBreaks = [], lineNo = cm.doc.first;
	    cm.doc.iter(function(line) {
	      for (var pos = 0;;) {
	        var found = line.text.indexOf(val, pos);
	        if (found == -1) break;
	        pos = found + val.length;
	        newBreaks.push(Pos(lineNo, found));
	      }
	      lineNo++;
	    });
	    for (var i = newBreaks.length - 1; i >= 0; i--)
	      replaceRange(cm.doc, val, newBreaks[i], Pos(newBreaks[i].line, newBreaks[i].ch + val.length))
	  });
	  option("specialChars", /[\u0000-\u001f\u007f\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g, function(cm, val, old) {
	    cm.state.specialChars = new RegExp(val.source + (val.test("\t") ? "" : "|\t"), "g");
	    if (old != CodeMirror.Init) cm.refresh();
	  });
	  option("specialCharPlaceholder", defaultSpecialCharPlaceholder, function(cm) {cm.refresh();}, true);
	  option("electricChars", true);
	  option("inputStyle", mobile ? "contenteditable" : "textarea", function() {
	    throw new Error("inputStyle can not (yet) be changed in a running editor"); // FIXME
	  }, true);
	  option("spellcheck", false, function(cm, val) {
	    cm.getInputField().spellcheck = val
	  }, true);
	  option("rtlMoveVisually", !windows);
	  option("wholeLineUpdateBefore", true);

	  option("theme", "default", function(cm) {
	    themeChanged(cm);
	    guttersChanged(cm);
	  }, true);
	  option("keyMap", "default", function(cm, val, old) {
	    var next = getKeyMap(val);
	    var prev = old != CodeMirror.Init && getKeyMap(old);
	    if (prev && prev.detach) prev.detach(cm, next);
	    if (next.attach) next.attach(cm, prev || null);
	  });
	  option("extraKeys", null);

	  option("lineWrapping", false, wrappingChanged, true);
	  option("gutters", [], function(cm) {
	    setGuttersForLineNumbers(cm.options);
	    guttersChanged(cm);
	  }, true);
	  option("fixedGutter", true, function(cm, val) {
	    cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";
	    cm.refresh();
	  }, true);
	  option("coverGutterNextToScrollbar", false, function(cm) {updateScrollbars(cm);}, true);
	  option("scrollbarStyle", "native", function(cm) {
	    initScrollbars(cm);
	    updateScrollbars(cm);
	    cm.display.scrollbars.setScrollTop(cm.doc.scrollTop);
	    cm.display.scrollbars.setScrollLeft(cm.doc.scrollLeft);
	  }, true);
	  option("lineNumbers", false, function(cm) {
	    setGuttersForLineNumbers(cm.options);
	    guttersChanged(cm);
	  }, true);
	  option("firstLineNumber", 1, guttersChanged, true);
	  option("lineNumberFormatter", function(integer) {return integer;}, guttersChanged, true);
	  option("showCursorWhenSelecting", false, updateSelection, true);

	  option("resetSelectionOnContextMenu", true);
	  option("lineWiseCopyCut", true);

	  option("readOnly", false, function(cm, val) {
	    if (val == "nocursor") {
	      onBlur(cm);
	      cm.display.input.blur();
	      cm.display.disabled = true;
	    } else {
	      cm.display.disabled = false;
	    }
	    cm.display.input.readOnlyChanged(val)
	  });
	  option("disableInput", false, function(cm, val) {if (!val) cm.display.input.reset();}, true);
	  option("dragDrop", true, dragDropChanged);
	  option("allowDropFileTypes", null);

	  option("cursorBlinkRate", 530);
	  option("cursorScrollMargin", 0);
	  option("cursorHeight", 1, updateSelection, true);
	  option("singleCursorHeightPerLine", true, updateSelection, true);
	  option("workTime", 100);
	  option("workDelay", 100);
	  option("flattenSpans", true, resetModeState, true);
	  option("addModeClass", false, resetModeState, true);
	  option("pollInterval", 100);
	  option("undoDepth", 200, function(cm, val){cm.doc.history.undoDepth = val;});
	  option("historyEventDelay", 1250);
	  option("viewportMargin", 10, function(cm){cm.refresh();}, true);
	  option("maxHighlightLength", 10000, resetModeState, true);
	  option("moveInputWithCursor", true, function(cm, val) {
	    if (!val) cm.display.input.resetPosition();
	  });

	  option("tabindex", null, function(cm, val) {
	    cm.display.input.getField().tabIndex = val || "";
	  });
	  option("autofocus", null);

	  // MODE DEFINITION AND QUERYING

	  // Known modes, by name and by MIME
	  var modes = CodeMirror.modes = {}, mimeModes = CodeMirror.mimeModes = {};

	  // Extra arguments are stored as the mode's dependencies, which is
	  // used by (legacy) mechanisms like loadmode.js to automatically
	  // load a mode. (Preferred mechanism is the require/define calls.)
	  CodeMirror.defineMode = function(name, mode) {
	    if (!CodeMirror.defaults.mode && name != "null") CodeMirror.defaults.mode = name;
	    if (arguments.length > 2)
	      mode.dependencies = Array.prototype.slice.call(arguments, 2);
	    modes[name] = mode;
	  };

	  CodeMirror.defineMIME = function(mime, spec) {
	    mimeModes[mime] = spec;
	  };

	  // Given a MIME type, a {name, ...options} config object, or a name
	  // string, return a mode config object.
	  CodeMirror.resolveMode = function(spec) {
	    if (typeof spec == "string" && mimeModes.hasOwnProperty(spec)) {
	      spec = mimeModes[spec];
	    } else if (spec && typeof spec.name == "string" && mimeModes.hasOwnProperty(spec.name)) {
	      var found = mimeModes[spec.name];
	      if (typeof found == "string") found = {name: found};
	      spec = createObj(found, spec);
	      spec.name = found.name;
	    } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) {
	      return CodeMirror.resolveMode("application/xml");
	    } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+json$/.test(spec)) {
	      return CodeMirror.resolveMode("application/json");
	    }
	    if (typeof spec == "string") return {name: spec};
	    else return spec || {name: "null"};
	  };

	  // Given a mode spec (anything that resolveMode accepts), find and
	  // initialize an actual mode object.
	  CodeMirror.getMode = function(options, spec) {
	    var spec = CodeMirror.resolveMode(spec);
	    var mfactory = modes[spec.name];
	    if (!mfactory) return CodeMirror.getMode(options, "text/plain");
	    var modeObj = mfactory(options, spec);
	    if (modeExtensions.hasOwnProperty(spec.name)) {
	      var exts = modeExtensions[spec.name];
	      for (var prop in exts) {
	        if (!exts.hasOwnProperty(prop)) continue;
	        if (modeObj.hasOwnProperty(prop)) modeObj["_" + prop] = modeObj[prop];
	        modeObj[prop] = exts[prop];
	      }
	    }
	    modeObj.name = spec.name;
	    if (spec.helperType) modeObj.helperType = spec.helperType;
	    if (spec.modeProps) for (var prop in spec.modeProps)
	      modeObj[prop] = spec.modeProps[prop];

	    return modeObj;
	  };

	  // Minimal default mode.
	  CodeMirror.defineMode("null", function() {
	    return {token: function(stream) {stream.skipToEnd();}};
	  });
	  CodeMirror.defineMIME("text/plain", "null");

	  // This can be used to attach properties to mode objects from
	  // outside the actual mode definition.
	  var modeExtensions = CodeMirror.modeExtensions = {};
	  CodeMirror.extendMode = function(mode, properties) {
	    var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : (modeExtensions[mode] = {});
	    copyObj(properties, exts);
	  };

	  // EXTENSIONS

	  CodeMirror.defineExtension = function(name, func) {
	    CodeMirror.prototype[name] = func;
	  };
	  CodeMirror.defineDocExtension = function(name, func) {
	    Doc.prototype[name] = func;
	  };
	  CodeMirror.defineOption = option;

	  var initHooks = [];
	  CodeMirror.defineInitHook = function(f) {initHooks.push(f);};

	  var helpers = CodeMirror.helpers = {};
	  CodeMirror.registerHelper = function(type, name, value) {
	    if (!helpers.hasOwnProperty(type)) helpers[type] = CodeMirror[type] = {_global: []};
	    helpers[type][name] = value;
	  };
	  CodeMirror.registerGlobalHelper = function(type, name, predicate, value) {
	    CodeMirror.registerHelper(type, name, value);
	    helpers[type]._global.push({pred: predicate, val: value});
	  };

	  // MODE STATE HANDLING

	  // Utility functions for working with state. Exported because nested
	  // modes need to do this for their inner modes.

	  var copyState = CodeMirror.copyState = function(mode, state) {
	    if (state === true) return state;
	    if (mode.copyState) return mode.copyState(state);
	    var nstate = {};
	    for (var n in state) {
	      var val = state[n];
	      if (val instanceof Array) val = val.concat([]);
	      nstate[n] = val;
	    }
	    return nstate;
	  };

	  var startState = CodeMirror.startState = function(mode, a1, a2) {
	    return mode.startState ? mode.startState(a1, a2) : true;
	  };

	  // Given a mode and a state (for that mode), find the inner mode and
	  // state at the position that the state refers to.
	  CodeMirror.innerMode = function(mode, state) {
	    while (mode.innerMode) {
	      var info = mode.innerMode(state);
	      if (!info || info.mode == mode) break;
	      state = info.state;
	      mode = info.mode;
	    }
	    return info || {mode: mode, state: state};
	  };

	  // STANDARD COMMANDS

	  // Commands are parameter-less actions that can be performed on an
	  // editor, mostly used for keybindings.
	  var commands = CodeMirror.commands = {
	    selectAll: function(cm) {cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()), sel_dontScroll);},
	    singleSelection: function(cm) {
	      cm.setSelection(cm.getCursor("anchor"), cm.getCursor("head"), sel_dontScroll);
	    },
	    killLine: function(cm) {
	      deleteNearSelection(cm, function(range) {
	        if (range.empty()) {
	          var len = getLine(cm.doc, range.head.line).text.length;
	          if (range.head.ch == len && range.head.line < cm.lastLine())
	            return {from: range.head, to: Pos(range.head.line + 1, 0)};
	          else
	            return {from: range.head, to: Pos(range.head.line, len)};
	        } else {
	          return {from: range.from(), to: range.to()};
	        }
	      });
	    },
	    deleteLine: function(cm) {
	      deleteNearSelection(cm, function(range) {
	        return {from: Pos(range.from().line, 0),
	                to: clipPos(cm.doc, Pos(range.to().line + 1, 0))};
	      });
	    },
	    delLineLeft: function(cm) {
	      deleteNearSelection(cm, function(range) {
	        return {from: Pos(range.from().line, 0), to: range.from()};
	      });
	    },
	    delWrappedLineLeft: function(cm) {
	      deleteNearSelection(cm, function(range) {
	        var top = cm.charCoords(range.head, "div").top + 5;
	        var leftPos = cm.coordsChar({left: 0, top: top}, "div");
	        return {from: leftPos, to: range.from()};
	      });
	    },
	    delWrappedLineRight: function(cm) {
	      deleteNearSelection(cm, function(range) {
	        var top = cm.charCoords(range.head, "div").top + 5;
	        var rightPos = cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div");
	        return {from: range.from(), to: rightPos };
	      });
	    },
	    undo: function(cm) {cm.undo();},
	    redo: function(cm) {cm.redo();},
	    undoSelection: function(cm) {cm.undoSelection();},
	    redoSelection: function(cm) {cm.redoSelection();},
	    goDocStart: function(cm) {cm.extendSelection(Pos(cm.firstLine(), 0));},
	    goDocEnd: function(cm) {cm.extendSelection(Pos(cm.lastLine()));},
	    goLineStart: function(cm) {
	      cm.extendSelectionsBy(function(range) { return lineStart(cm, range.head.line); },
	                            {origin: "+move", bias: 1});
	    },
	    goLineStartSmart: function(cm) {
	      cm.extendSelectionsBy(function(range) {
	        return lineStartSmart(cm, range.head);
	      }, {origin: "+move", bias: 1});
	    },
	    goLineEnd: function(cm) {
	      cm.extendSelectionsBy(function(range) { return lineEnd(cm, range.head.line); },
	                            {origin: "+move", bias: -1});
	    },
	    goLineRight: function(cm) {
	      cm.extendSelectionsBy(function(range) {
	        var top = cm.charCoords(range.head, "div").top + 5;
	        return cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div");
	      }, sel_move);
	    },
	    goLineLeft: function(cm) {
	      cm.extendSelectionsBy(function(range) {
	        var top = cm.charCoords(range.head, "div").top + 5;
	        return cm.coordsChar({left: 0, top: top}, "div");
	      }, sel_move);
	    },
	    goLineLeftSmart: function(cm) {
	      cm.extendSelectionsBy(function(range) {
	        var top = cm.charCoords(range.head, "div").top + 5;
	        var pos = cm.coordsChar({left: 0, top: top}, "div");
	        if (pos.ch < cm.getLine(pos.line).search(/\S/)) return lineStartSmart(cm, range.head);
	        return pos;
	      }, sel_move);
	    },
	    goLineUp: function(cm) {cm.moveV(-1, "line");},
	    goLineDown: function(cm) {cm.moveV(1, "line");},
	    goPageUp: function(cm) {cm.moveV(-1, "page");},
	    goPageDown: function(cm) {cm.moveV(1, "page");},
	    goCharLeft: function(cm) {cm.moveH(-1, "char");},
	    goCharRight: function(cm) {cm.moveH(1, "char");},
	    goColumnLeft: function(cm) {cm.moveH(-1, "column");},
	    goColumnRight: function(cm) {cm.moveH(1, "column");},
	    goWordLeft: function(cm) {cm.moveH(-1, "word");},
	    goGroupRight: function(cm) {cm.moveH(1, "group");},
	    goGroupLeft: function(cm) {cm.moveH(-1, "group");},
	    goWordRight: function(cm) {cm.moveH(1, "word");},
	    delCharBefore: function(cm) {cm.deleteH(-1, "char");},
	    delCharAfter: function(cm) {cm.deleteH(1, "char");},
	    delWordBefore: function(cm) {cm.deleteH(-1, "word");},
	    delWordAfter: function(cm) {cm.deleteH(1, "word");},
	    delGroupBefore: function(cm) {cm.deleteH(-1, "group");},
	    delGroupAfter: function(cm) {cm.deleteH(1, "group");},
	    indentAuto: function(cm) {cm.indentSelection("smart");},
	    indentMore: function(cm) {cm.indentSelection("add");},
	    indentLess: function(cm) {cm.indentSelection("subtract");},
	    insertTab: function(cm) {cm.replaceSelection("\t");},
	    insertSoftTab: function(cm) {
	      var spaces = [], ranges = cm.listSelections(), tabSize = cm.options.tabSize;
	      for (var i = 0; i < ranges.length; i++) {
	        var pos = ranges[i].from();
	        var col = countColumn(cm.getLine(pos.line), pos.ch, tabSize);
	        spaces.push(spaceStr(tabSize - col % tabSize));
	      }
	      cm.replaceSelections(spaces);
	    },
	    defaultTab: function(cm) {
	      if (cm.somethingSelected()) cm.indentSelection("add");
	      else cm.execCommand("insertTab");
	    },
	    transposeChars: function(cm) {
	      runInOp(cm, function() {
	        var ranges = cm.listSelections(), newSel = [];
	        for (var i = 0; i < ranges.length; i++) {
	          var cur = ranges[i].head, line = getLine(cm.doc, cur.line).text;
	          if (line) {
	            if (cur.ch == line.length) cur = new Pos(cur.line, cur.ch - 1);
	            if (cur.ch > 0) {
	              cur = new Pos(cur.line, cur.ch + 1);
	              cm.replaceRange(line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2),
	                              Pos(cur.line, cur.ch - 2), cur, "+transpose");
	            } else if (cur.line > cm.doc.first) {
	              var prev = getLine(cm.doc, cur.line - 1).text;
	              if (prev)
	                cm.replaceRange(line.charAt(0) + cm.doc.lineSeparator() +
	                                prev.charAt(prev.length - 1),
	                                Pos(cur.line - 1, prev.length - 1), Pos(cur.line, 1), "+transpose");
	            }
	          }
	          newSel.push(new Range(cur, cur));
	        }
	        cm.setSelections(newSel);
	      });
	    },
	    newlineAndIndent: function(cm) {
	      runInOp(cm, function() {
	        var len = cm.listSelections().length;
	        for (var i = 0; i < len; i++) {
	          var range = cm.listSelections()[i];
	          cm.replaceRange(cm.doc.lineSeparator(), range.anchor, range.head, "+input");
	          cm.indentLine(range.from().line + 1, null, true);
	        }
	        ensureCursorVisible(cm);
	      });
	    },
	    openLine: function(cm) {cm.replaceSelection("\n", "start")},
	    toggleOverwrite: function(cm) {cm.toggleOverwrite();}
	  };


	  // STANDARD KEYMAPS

	  var keyMap = CodeMirror.keyMap = {};

	  keyMap.basic = {
	    "Left": "goCharLeft", "Right": "goCharRight", "Up": "goLineUp", "Down": "goLineDown",
	    "End": "goLineEnd", "Home": "goLineStartSmart", "PageUp": "goPageUp", "PageDown": "goPageDown",
	    "Delete": "delCharAfter", "Backspace": "delCharBefore", "Shift-Backspace": "delCharBefore",
	    "Tab": "defaultTab", "Shift-Tab": "indentAuto",
	    "Enter": "newlineAndIndent", "Insert": "toggleOverwrite",
	    "Esc": "singleSelection"
	  };
	  // Note that the save and find-related commands aren't defined by
	  // default. User code or addons can define them. Unknown commands
	  // are simply ignored.
	  keyMap.pcDefault = {
	    "Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo",
	    "Ctrl-Home": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Up": "goLineUp", "Ctrl-Down": "goLineDown",
	    "Ctrl-Left": "goGroupLeft", "Ctrl-Right": "goGroupRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd",
	    "Ctrl-Backspace": "delGroupBefore", "Ctrl-Delete": "delGroupAfter", "Ctrl-S": "save", "Ctrl-F": "find",
	    "Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll",
	    "Ctrl-[": "indentLess", "Ctrl-]": "indentMore",
	    "Ctrl-U": "undoSelection", "Shift-Ctrl-U": "redoSelection", "Alt-U": "redoSelection",
	    fallthrough: "basic"
	  };
	  // Very basic readline/emacs-style bindings, which are standard on Mac.
	  keyMap.emacsy = {
	    "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown",
	    "Alt-F": "goWordRight", "Alt-B": "goWordLeft", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd",
	    "Ctrl-V": "goPageDown", "Shift-Ctrl-V": "goPageUp", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore",
	    "Alt-D": "delWordAfter", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars",
	    "Ctrl-O": "openLine"
	  };
	  keyMap.macDefault = {
	    "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo",
	    "Cmd-Home": "goDocStart", "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goGroupLeft",
	    "Alt-Right": "goGroupRight", "Cmd-Left": "goLineLeft", "Cmd-Right": "goLineRight", "Alt-Backspace": "delGroupBefore",
	    "Ctrl-Alt-Backspace": "delGroupAfter", "Alt-Delete": "delGroupAfter", "Cmd-S": "save", "Cmd-F": "find",
	    "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll",
	    "Cmd-[": "indentLess", "Cmd-]": "indentMore", "Cmd-Backspace": "delWrappedLineLeft", "Cmd-Delete": "delWrappedLineRight",
	    "Cmd-U": "undoSelection", "Shift-Cmd-U": "redoSelection", "Ctrl-Up": "goDocStart", "Ctrl-Down": "goDocEnd",
	    fallthrough: ["basic", "emacsy"]
	  };
	  keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault;

	  // KEYMAP DISPATCH

	  function normalizeKeyName(name) {
	    var parts = name.split(/-(?!$)/), name = parts[parts.length - 1];
	    var alt, ctrl, shift, cmd;
	    for (var i = 0; i < parts.length - 1; i++) {
	      var mod = parts[i];
	      if (/^(cmd|meta|m)$/i.test(mod)) cmd = true;
	      else if (/^a(lt)?$/i.test(mod)) alt = true;
	      else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = true;
	      else if (/^s(hift)$/i.test(mod)) shift = true;
	      else throw new Error("Unrecognized modifier name: " + mod);
	    }
	    if (alt) name = "Alt-" + name;
	    if (ctrl) name = "Ctrl-" + name;
	    if (cmd) name = "Cmd-" + name;
	    if (shift) name = "Shift-" + name;
	    return name;
	  }

	  // This is a kludge to keep keymaps mostly working as raw objects
	  // (backwards compatibility) while at the same time support features
	  // like normalization and multi-stroke key bindings. It compiles a
	  // new normalized keymap, and then updates the old object to reflect
	  // this.
	  CodeMirror.normalizeKeyMap = function(keymap) {
	    var copy = {};
	    for (var keyname in keymap) if (keymap.hasOwnProperty(keyname)) {
	      var value = keymap[keyname];
	      if (/^(name|fallthrough|(de|at)tach)$/.test(keyname)) continue;
	      if (value == "...") { delete keymap[keyname]; continue; }

	      var keys = map(keyname.split(" "), normalizeKeyName);
	      for (var i = 0; i < keys.length; i++) {
	        var val, name;
	        if (i == keys.length - 1) {
	          name = keys.join(" ");
	          val = value;
	        } else {
	          name = keys.slice(0, i + 1).join(" ");
	          val = "...";
	        }
	        var prev = copy[name];
	        if (!prev) copy[name] = val;
	        else if (prev != val) throw new Error("Inconsistent bindings for " + name);
	      }
	      delete keymap[keyname];
	    }
	    for (var prop in copy) keymap[prop] = copy[prop];
	    return keymap;
	  };

	  var lookupKey = CodeMirror.lookupKey = function(key, map, handle, context) {
	    map = getKeyMap(map);
	    var found = map.call ? map.call(key, context) : map[key];
	    if (found === false) return "nothing";
	    if (found === "...") return "multi";
	    if (found != null && handle(found)) return "handled";

	    if (map.fallthrough) {
	      if (Object.prototype.toString.call(map.fallthrough) != "[object Array]")
	        return lookupKey(key, map.fallthrough, handle, context);
	      for (var i = 0; i < map.fallthrough.length; i++) {
	        var result = lookupKey(key, map.fallthrough[i], handle, context);
	        if (result) return result;
	      }
	    }
	  };

	  // Modifier key presses don't count as 'real' key presses for the
	  // purpose of keymap fallthrough.
	  var isModifierKey = CodeMirror.isModifierKey = function(value) {
	    var name = typeof value == "string" ? value : keyNames[value.keyCode];
	    return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
	  };

	  // Look up the name of a key as indicated by an event object.
	  var keyName = CodeMirror.keyName = function(event, noShift) {
	    if (presto && event.keyCode == 34 && event["char"]) return false;
	    var base = keyNames[event.keyCode], name = base;
	    if (name == null || event.altGraphKey) return false;
	    if (event.altKey && base != "Alt") name = "Alt-" + name;
	    if ((flipCtrlCmd ? event.metaKey : event.ctrlKey) && base != "Ctrl") name = "Ctrl-" + name;
	    if ((flipCtrlCmd ? event.ctrlKey : event.metaKey) && base != "Cmd") name = "Cmd-" + name;
	    if (!noShift && event.shiftKey && base != "Shift") name = "Shift-" + name;
	    return name;
	  };

	  function getKeyMap(val) {
	    return typeof val == "string" ? keyMap[val] : val;
	  }

	  // FROMTEXTAREA

	  CodeMirror.fromTextArea = function(textarea, options) {
	    options = options ? copyObj(options) : {};
	    options.value = textarea.value;
	    if (!options.tabindex && textarea.tabIndex)
	      options.tabindex = textarea.tabIndex;
	    if (!options.placeholder && textarea.placeholder)
	      options.placeholder = textarea.placeholder;
	    // Set autofocus to true if this textarea is focused, or if it has
	    // autofocus and no other element is focused.
	    if (options.autofocus == null) {
	      var hasFocus = activeElt();
	      options.autofocus = hasFocus == textarea ||
	        textarea.getAttribute("autofocus") != null && hasFocus == document.body;
	    }

	    function save() {textarea.value = cm.getValue();}
	    if (textarea.form) {
	      on(textarea.form, "submit", save);
	      // Deplorable hack to make the submit method do the right thing.
	      if (!options.leaveSubmitMethodAlone) {
	        var form = textarea.form, realSubmit = form.submit;
	        try {
	          var wrappedSubmit = form.submit = function() {
	            save();
	            form.submit = realSubmit;
	            form.submit();
	            form.submit = wrappedSubmit;
	          };
	        } catch(e) {}
	      }
	    }

	    options.finishInit = function(cm) {
	      cm.save = save;
	      cm.getTextArea = function() { return textarea; };
	      cm.toTextArea = function() {
	        cm.toTextArea = isNaN; // Prevent this from being ran twice
	        save();
	        textarea.parentNode.removeChild(cm.getWrapperElement());
	        textarea.style.display = "";
	        if (textarea.form) {
	          off(textarea.form, "submit", save);
	          if (typeof textarea.form.submit == "function")
	            textarea.form.submit = realSubmit;
	        }
	      };
	    };

	    textarea.style.display = "none";
	    var cm = CodeMirror(function(node) {
	      textarea.parentNode.insertBefore(node, textarea.nextSibling);
	    }, options);
	    return cm;
	  };

	  // STRING STREAM

	  // Fed to the mode parsers, provides helper functions to make
	  // parsers more succinct.

	  var StringStream = CodeMirror.StringStream = function(string, tabSize) {
	    this.pos = this.start = 0;
	    this.string = string;
	    this.tabSize = tabSize || 8;
	    this.lastColumnPos = this.lastColumnValue = 0;
	    this.lineStart = 0;
	  };

	  StringStream.prototype = {
	    eol: function() {return this.pos >= this.string.length;},
	    sol: function() {return this.pos == this.lineStart;},
	    peek: function() {return this.string.charAt(this.pos) || undefined;},
	    next: function() {
	      if (this.pos < this.string.length)
	        return this.string.charAt(this.pos++);
	    },
	    eat: function(match) {
	      var ch = this.string.charAt(this.pos);
	      if (typeof match == "string") var ok = ch == match;
	      else var ok = ch && (match.test ? match.test(ch) : match(ch));
	      if (ok) {++this.pos; return ch;}
	    },
	    eatWhile: function(match) {
	      var start = this.pos;
	      while (this.eat(match)){}
	      return this.pos > start;
	    },
	    eatSpace: function() {
	      var start = this.pos;
	      while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;
	      return this.pos > start;
	    },
	    skipToEnd: function() {this.pos = this.string.length;},
	    skipTo: function(ch) {
	      var found = this.string.indexOf(ch, this.pos);
	      if (found > -1) {this.pos = found; return true;}
	    },
	    backUp: function(n) {this.pos -= n;},
	    column: function() {
	      if (this.lastColumnPos < this.start) {
	        this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
	        this.lastColumnPos = this.start;
	      }
	      return this.lastColumnValue - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
	    },
	    indentation: function() {
	      return countColumn(this.string, null, this.tabSize) -
	        (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
	    },
	    match: function(pattern, consume, caseInsensitive) {
	      if (typeof pattern == "string") {
	        var cased = function(str) {return caseInsensitive ? str.toLowerCase() : str;};
	        var substr = this.string.substr(this.pos, pattern.length);
	        if (cased(substr) == cased(pattern)) {
	          if (consume !== false) this.pos += pattern.length;
	          return true;
	        }
	      } else {
	        var match = this.string.slice(this.pos).match(pattern);
	        if (match && match.index > 0) return null;
	        if (match && consume !== false) this.pos += match[0].length;
	        return match;
	      }
	    },
	    current: function(){return this.string.slice(this.start, this.pos);},
	    hideFirstChars: function(n, inner) {
	      this.lineStart += n;
	      try { return inner(); }
	      finally { this.lineStart -= n; }
	    }
	  };

	  // TEXTMARKERS

	  // Created with markText and setBookmark methods. A TextMarker is a
	  // handle that can be used to clear or find a marked position in the
	  // document. Line objects hold arrays (markedSpans) containing
	  // {from, to, marker} object pointing to such marker objects, and
	  // indicating that such a marker is present on that line. Multiple
	  // lines may point to the same marker when it spans across lines.
	  // The spans will have null for their from/to properties when the
	  // marker continues beyond the start/end of the line. Markers have
	  // links back to the lines they currently touch.

	  var nextMarkerId = 0;

	  var TextMarker = CodeMirror.TextMarker = function(doc, type) {
	    this.lines = [];
	    this.type = type;
	    this.doc = doc;
	    this.id = ++nextMarkerId;
	  };
	  eventMixin(TextMarker);

	  // Clear the marker.
	  TextMarker.prototype.clear = function() {
	    if (this.explicitlyCleared) return;
	    var cm = this.doc.cm, withOp = cm && !cm.curOp;
	    if (withOp) startOperation(cm);
	    if (hasHandler(this, "clear")) {
	      var found = this.find();
	      if (found) signalLater(this, "clear", found.from, found.to);
	    }
	    var min = null, max = null;
	    for (var i = 0; i < this.lines.length; ++i) {
	      var line = this.lines[i];
	      var span = getMarkedSpanFor(line.markedSpans, this);
	      if (cm && !this.collapsed) regLineChange(cm, lineNo(line), "text");
	      else if (cm) {
	        if (span.to != null) max = lineNo(line);
	        if (span.from != null) min = lineNo(line);
	      }
	      line.markedSpans = removeMarkedSpan(line.markedSpans, span);
	      if (span.from == null && this.collapsed && !lineIsHidden(this.doc, line) && cm)
	        updateLineHeight(line, textHeight(cm.display));
	    }
	    if (cm && this.collapsed && !cm.options.lineWrapping) for (var i = 0; i < this.lines.length; ++i) {
	      var visual = visualLine(this.lines[i]), len = lineLength(visual);
	      if (len > cm.display.maxLineLength) {
	        cm.display.maxLine = visual;
	        cm.display.maxLineLength = len;
	        cm.display.maxLineChanged = true;
	      }
	    }

	    if (min != null && cm && this.collapsed) regChange(cm, min, max + 1);
	    this.lines.length = 0;
	    this.explicitlyCleared = true;
	    if (this.atomic && this.doc.cantEdit) {
	      this.doc.cantEdit = false;
	      if (cm) reCheckSelection(cm.doc);
	    }
	    if (cm) signalLater(cm, "markerCleared", cm, this);
	    if (withOp) endOperation(cm);
	    if (this.parent) this.parent.clear();
	  };

	  // Find the position of the marker in the document. Returns a {from,
	  // to} object by default. Side can be passed to get a specific side
	  // -- 0 (both), -1 (left), or 1 (right). When lineObj is true, the
	  // Pos objects returned contain a line object, rather than a line
	  // number (used to prevent looking up the same line twice).
	  TextMarker.prototype.find = function(side, lineObj) {
	    if (side == null && this.type == "bookmark") side = 1;
	    var from, to;
	    for (var i = 0; i < this.lines.length; ++i) {
	      var line = this.lines[i];
	      var span = getMarkedSpanFor(line.markedSpans, this);
	      if (span.from != null) {
	        from = Pos(lineObj ? line : lineNo(line), span.from);
	        if (side == -1) return from;
	      }
	      if (span.to != null) {
	        to = Pos(lineObj ? line : lineNo(line), span.to);
	        if (side == 1) return to;
	      }
	    }
	    return from && {from: from, to: to};
	  };

	  // Signals that the marker's widget changed, and surrounding layout
	  // should be recomputed.
	  TextMarker.prototype.changed = function() {
	    var pos = this.find(-1, true), widget = this, cm = this.doc.cm;
	    if (!pos || !cm) return;
	    runInOp(cm, function() {
	      var line = pos.line, lineN = lineNo(pos.line);
	      var view = findViewForLine(cm, lineN);
	      if (view) {
	        clearLineMeasurementCacheFor(view);
	        cm.curOp.selectionChanged = cm.curOp.forceUpdate = true;
	      }
	      cm.curOp.updateMaxLine = true;
	      if (!lineIsHidden(widget.doc, line) && widget.height != null) {
	        var oldHeight = widget.height;
	        widget.height = null;
	        var dHeight = widgetHeight(widget) - oldHeight;
	        if (dHeight)
	          updateLineHeight(line, line.height + dHeight);
	      }
	    });
	  };

	  TextMarker.prototype.attachLine = function(line) {
	    if (!this.lines.length && this.doc.cm) {
	      var op = this.doc.cm.curOp;
	      if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1)
	        (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
	    }
	    this.lines.push(line);
	  };
	  TextMarker.prototype.detachLine = function(line) {
	    this.lines.splice(indexOf(this.lines, line), 1);
	    if (!this.lines.length && this.doc.cm) {
	      var op = this.doc.cm.curOp;
	      (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
	    }
	  };

	  // Collapsed markers have unique ids, in order to be able to order
	  // them, which is needed for uniquely determining an outer marker
	  // when they overlap (they may nest, but not partially overlap).
	  var nextMarkerId = 0;

	  // Create a marker, wire it up to the right lines, and
	  function markText(doc, from, to, options, type) {
	    // Shared markers (across linked documents) are handled separately
	    // (markTextShared will call out to this again, once per
	    // document).
	    if (options && options.shared) return markTextShared(doc, from, to, options, type);
	    // Ensure we are in an operation.
	    if (doc.cm && !doc.cm.curOp) return operation(doc.cm, markText)(doc, from, to, options, type);

	    var marker = new TextMarker(doc, type), diff = cmp(from, to);
	    if (options) copyObj(options, marker, false);
	    // Don't connect empty markers unless clearWhenEmpty is false
	    if (diff > 0 || diff == 0 && marker.clearWhenEmpty !== false)
	      return marker;
	    if (marker.replacedWith) {
	      // Showing up as a widget implies collapsed (widget replaces text)
	      marker.collapsed = true;
	      marker.widgetNode = elt("span", [marker.replacedWith], "CodeMirror-widget");
	      if (!options.handleMouseEvents) marker.widgetNode.setAttribute("cm-ignore-events", "true");
	      if (options.insertLeft) marker.widgetNode.insertLeft = true;
	    }
	    if (marker.collapsed) {
	      if (conflictingCollapsedRange(doc, from.line, from, to, marker) ||
	          from.line != to.line && conflictingCollapsedRange(doc, to.line, from, to, marker))
	        throw new Error("Inserting collapsed marker partially overlapping an existing one");
	      sawCollapsedSpans = true;
	    }

	    if (marker.addToHistory)
	      addChangeToHistory(doc, {from: from, to: to, origin: "markText"}, doc.sel, NaN);

	    var curLine = from.line, cm = doc.cm, updateMaxLine;
	    doc.iter(curLine, to.line + 1, function(line) {
	      if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(line) == cm.display.maxLine)
	        updateMaxLine = true;
	      if (marker.collapsed && curLine != from.line) updateLineHeight(line, 0);
	      addMarkedSpan(line, new MarkedSpan(marker,
	                                         curLine == from.line ? from.ch : null,
	                                         curLine == to.line ? to.ch : null));
	      ++curLine;
	    });
	    // lineIsHidden depends on the presence of the spans, so needs a second pass
	    if (marker.collapsed) doc.iter(from.line, to.line + 1, function(line) {
	      if (lineIsHidden(doc, line)) updateLineHeight(line, 0);
	    });

	    if (marker.clearOnEnter) on(marker, "beforeCursorEnter", function() { marker.clear(); });

	    if (marker.readOnly) {
	      sawReadOnlySpans = true;
	      if (doc.history.done.length || doc.history.undone.length)
	        doc.clearHistory();
	    }
	    if (marker.collapsed) {
	      marker.id = ++nextMarkerId;
	      marker.atomic = true;
	    }
	    if (cm) {
	      // Sync editor state
	      if (updateMaxLine) cm.curOp.updateMaxLine = true;
	      if (marker.collapsed)
	        regChange(cm, from.line, to.line + 1);
	      else if (marker.className || marker.title || marker.startStyle || marker.endStyle || marker.css)
	        for (var i = from.line; i <= to.line; i++) regLineChange(cm, i, "text");
	      if (marker.atomic) reCheckSelection(cm.doc);
	      signalLater(cm, "markerAdded", cm, marker);
	    }
	    return marker;
	  }

	  // SHARED TEXTMARKERS

	  // A shared marker spans multiple linked documents. It is
	  // implemented as a meta-marker-object controlling multiple normal
	  // markers.
	  var SharedTextMarker = CodeMirror.SharedTextMarker = function(markers, primary) {
	    this.markers = markers;
	    this.primary = primary;
	    for (var i = 0; i < markers.length; ++i)
	      markers[i].parent = this;
	  };
	  eventMixin(SharedTextMarker);

	  SharedTextMarker.prototype.clear = function() {
	    if (this.explicitlyCleared) return;
	    this.explicitlyCleared = true;
	    for (var i = 0; i < this.markers.length; ++i)
	      this.markers[i].clear();
	    signalLater(this, "clear");
	  };
	  SharedTextMarker.prototype.find = function(side, lineObj) {
	    return this.primary.find(side, lineObj);
	  };

	  function markTextShared(doc, from, to, options, type) {
	    options = copyObj(options);
	    options.shared = false;
	    var markers = [markText(doc, from, to, options, type)], primary = markers[0];
	    var widget = options.widgetNode;
	    linkedDocs(doc, function(doc) {
	      if (widget) options.widgetNode = widget.cloneNode(true);
	      markers.push(markText(doc, clipPos(doc, from), clipPos(doc, to), options, type));
	      for (var i = 0; i < doc.linked.length; ++i)
	        if (doc.linked[i].isParent) return;
	      primary = lst(markers);
	    });
	    return new SharedTextMarker(markers, primary);
	  }

	  function findSharedMarkers(doc) {
	    return doc.findMarks(Pos(doc.first, 0), doc.clipPos(Pos(doc.lastLine())),
	                         function(m) { return m.parent; });
	  }

	  function copySharedMarkers(doc, markers) {
	    for (var i = 0; i < markers.length; i++) {
	      var marker = markers[i], pos = marker.find();
	      var mFrom = doc.clipPos(pos.from), mTo = doc.clipPos(pos.to);
	      if (cmp(mFrom, mTo)) {
	        var subMark = markText(doc, mFrom, mTo, marker.primary, marker.primary.type);
	        marker.markers.push(subMark);
	        subMark.parent = marker;
	      }
	    }
	  }

	  function detachSharedMarkers(markers) {
	    for (var i = 0; i < markers.length; i++) {
	      var marker = markers[i], linked = [marker.primary.doc];;
	      linkedDocs(marker.primary.doc, function(d) { linked.push(d); });
	      for (var j = 0; j < marker.markers.length; j++) {
	        var subMarker = marker.markers[j];
	        if (indexOf(linked, subMarker.doc) == -1) {
	          subMarker.parent = null;
	          marker.markers.splice(j--, 1);
	        }
	      }
	    }
	  }

	  // TEXTMARKER SPANS

	  function MarkedSpan(marker, from, to) {
	    this.marker = marker;
	    this.from = from; this.to = to;
	  }

	  // Search an array of spans for a span matching the given marker.
	  function getMarkedSpanFor(spans, marker) {
	    if (spans) for (var i = 0; i < spans.length; ++i) {
	      var span = spans[i];
	      if (span.marker == marker) return span;
	    }
	  }
	  // Remove a span from an array, returning undefined if no spans are
	  // left (we don't store arrays for lines without spans).
	  function removeMarkedSpan(spans, span) {
	    for (var r, i = 0; i < spans.length; ++i)
	      if (spans[i] != span) (r || (r = [])).push(spans[i]);
	    return r;
	  }
	  // Add a span to a line.
	  function addMarkedSpan(line, span) {
	    line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
	    span.marker.attachLine(line);
	  }

	  // Used for the algorithm that adjusts markers for a change in the
	  // document. These functions cut an array of spans at a given
	  // character position, returning an array of remaining chunks (or
	  // undefined if nothing remains).
	  function markedSpansBefore(old, startCh, isInsert) {
	    if (old) for (var i = 0, nw; i < old.length; ++i) {
	      var span = old[i], marker = span.marker;
	      var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
	      if (startsBefore || span.from == startCh && marker.type == "bookmark" && (!isInsert || !span.marker.insertLeft)) {
	        var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
	        (nw || (nw = [])).push(new MarkedSpan(marker, span.from, endsAfter ? null : span.to));
	      }
	    }
	    return nw;
	  }
	  function markedSpansAfter(old, endCh, isInsert) {
	    if (old) for (var i = 0, nw; i < old.length; ++i) {
	      var span = old[i], marker = span.marker;
	      var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
	      if (endsAfter || span.from == endCh && marker.type == "bookmark" && (!isInsert || span.marker.insertLeft)) {
	        var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
	        (nw || (nw = [])).push(new MarkedSpan(marker, startsBefore ? null : span.from - endCh,
	                                              span.to == null ? null : span.to - endCh));
	      }
	    }
	    return nw;
	  }

	  // Given a change object, compute the new set of marker spans that
	  // cover the line in which the change took place. Removes spans
	  // entirely within the change, reconnects spans belonging to the
	  // same marker that appear on both sides of the change, and cuts off
	  // spans partially within the change. Returns an array of span
	  // arrays with one element for each line in (after) the change.
	  function stretchSpansOverChange(doc, change) {
	    if (change.full) return null;
	    var oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans;
	    var oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;
	    if (!oldFirst && !oldLast) return null;

	    var startCh = change.from.ch, endCh = change.to.ch, isInsert = cmp(change.from, change.to) == 0;
	    // Get the spans that 'stick out' on both sides
	    var first = markedSpansBefore(oldFirst, startCh, isInsert);
	    var last = markedSpansAfter(oldLast, endCh, isInsert);

	    // Next, merge those two ends
	    var sameLine = change.text.length == 1, offset = lst(change.text).length + (sameLine ? startCh : 0);
	    if (first) {
	      // Fix up .to properties of first
	      for (var i = 0; i < first.length; ++i) {
	        var span = first[i];
	        if (span.to == null) {
	          var found = getMarkedSpanFor(last, span.marker);
	          if (!found) span.to = startCh;
	          else if (sameLine) span.to = found.to == null ? null : found.to + offset;
	        }
	      }
	    }
	    if (last) {
	      // Fix up .from in last (or move them into first in case of sameLine)
	      for (var i = 0; i < last.length; ++i) {
	        var span = last[i];
	        if (span.to != null) span.to += offset;
	        if (span.from == null) {
	          var found = getMarkedSpanFor(first, span.marker);
	          if (!found) {
	            span.from = offset;
	            if (sameLine) (first || (first = [])).push(span);
	          }
	        } else {
	          span.from += offset;
	          if (sameLine) (first || (first = [])).push(span);
	        }
	      }
	    }
	    // Make sure we didn't create any zero-length spans
	    if (first) first = clearEmptySpans(first);
	    if (last && last != first) last = clearEmptySpans(last);

	    var newMarkers = [first];
	    if (!sameLine) {
	      // Fill gap with whole-line-spans
	      var gap = change.text.length - 2, gapMarkers;
	      if (gap > 0 && first)
	        for (var i = 0; i < first.length; ++i)
	          if (first[i].to == null)
	            (gapMarkers || (gapMarkers = [])).push(new MarkedSpan(first[i].marker, null, null));
	      for (var i = 0; i < gap; ++i)
	        newMarkers.push(gapMarkers);
	      newMarkers.push(last);
	    }
	    return newMarkers;
	  }

	  // Remove spans that are empty and don't have a clearWhenEmpty
	  // option of false.
	  function clearEmptySpans(spans) {
	    for (var i = 0; i < spans.length; ++i) {
	      var span = spans[i];
	      if (span.from != null && span.from == span.to && span.marker.clearWhenEmpty !== false)
	        spans.splice(i--, 1);
	    }
	    if (!spans.length) return null;
	    return spans;
	  }

	  // Used for un/re-doing changes from the history. Combines the
	  // result of computing the existing spans with the set of spans that
	  // existed in the history (so that deleting around a span and then
	  // undoing brings back the span).
	  function mergeOldSpans(doc, change) {
	    var old = getOldSpans(doc, change);
	    var stretched = stretchSpansOverChange(doc, change);
	    if (!old) return stretched;
	    if (!stretched) return old;

	    for (var i = 0; i < old.length; ++i) {
	      var oldCur = old[i], stretchCur = stretched[i];
	      if (oldCur && stretchCur) {
	        spans: for (var j = 0; j < stretchCur.length; ++j) {
	          var span = stretchCur[j];
	          for (var k = 0; k < oldCur.length; ++k)
	            if (oldCur[k].marker == span.marker) continue spans;
	          oldCur.push(span);
	        }
	      } else if (stretchCur) {
	        old[i] = stretchCur;
	      }
	    }
	    return old;
	  }

	  // Used to 'clip' out readOnly ranges when making a change.
	  function removeReadOnlyRanges(doc, from, to) {
	    var markers = null;
	    doc.iter(from.line, to.line + 1, function(line) {
	      if (line.markedSpans) for (var i = 0; i < line.markedSpans.length; ++i) {
	        var mark = line.markedSpans[i].marker;
	        if (mark.readOnly && (!markers || indexOf(markers, mark) == -1))
	          (markers || (markers = [])).push(mark);
	      }
	    });
	    if (!markers) return null;
	    var parts = [{from: from, to: to}];
	    for (var i = 0; i < markers.length; ++i) {
	      var mk = markers[i], m = mk.find(0);
	      for (var j = 0; j < parts.length; ++j) {
	        var p = parts[j];
	        if (cmp(p.to, m.from) < 0 || cmp(p.from, m.to) > 0) continue;
	        var newParts = [j, 1], dfrom = cmp(p.from, m.from), dto = cmp(p.to, m.to);
	        if (dfrom < 0 || !mk.inclusiveLeft && !dfrom)
	          newParts.push({from: p.from, to: m.from});
	        if (dto > 0 || !mk.inclusiveRight && !dto)
	          newParts.push({from: m.to, to: p.to});
	        parts.splice.apply(parts, newParts);
	        j += newParts.length - 1;
	      }
	    }
	    return parts;
	  }

	  // Connect or disconnect spans from a line.
	  function detachMarkedSpans(line) {
	    var spans = line.markedSpans;
	    if (!spans) return;
	    for (var i = 0; i < spans.length; ++i)
	      spans[i].marker.detachLine(line);
	    line.markedSpans = null;
	  }
	  function attachMarkedSpans(line, spans) {
	    if (!spans) return;
	    for (var i = 0; i < spans.length; ++i)
	      spans[i].marker.attachLine(line);
	    line.markedSpans = spans;
	  }

	  // Helpers used when computing which overlapping collapsed span
	  // counts as the larger one.
	  function extraLeft(marker) { return marker.inclusiveLeft ? -1 : 0; }
	  function extraRight(marker) { return marker.inclusiveRight ? 1 : 0; }

	  // Returns a number indicating which of two overlapping collapsed
	  // spans is larger (and thus includes the other). Falls back to
	  // comparing ids when the spans cover exactly the same range.
	  function compareCollapsedMarkers(a, b) {
	    var lenDiff = a.lines.length - b.lines.length;
	    if (lenDiff != 0) return lenDiff;
	    var aPos = a.find(), bPos = b.find();
	    var fromCmp = cmp(aPos.from, bPos.from) || extraLeft(a) - extraLeft(b);
	    if (fromCmp) return -fromCmp;
	    var toCmp = cmp(aPos.to, bPos.to) || extraRight(a) - extraRight(b);
	    if (toCmp) return toCmp;
	    return b.id - a.id;
	  }

	  // Find out whether a line ends or starts in a collapsed span. If
	  // so, return the marker for that span.
	  function collapsedSpanAtSide(line, start) {
	    var sps = sawCollapsedSpans && line.markedSpans, found;
	    if (sps) for (var sp, i = 0; i < sps.length; ++i) {
	      sp = sps[i];
	      if (sp.marker.collapsed && (start ? sp.from : sp.to) == null &&
	          (!found || compareCollapsedMarkers(found, sp.marker) < 0))
	        found = sp.marker;
	    }
	    return found;
	  }
	  function collapsedSpanAtStart(line) { return collapsedSpanAtSide(line, true); }
	  function collapsedSpanAtEnd(line) { return collapsedSpanAtSide(line, false); }

	  // Test whether there exists a collapsed span that partially
	  // overlaps (covers the start or end, but not both) of a new span.
	  // Such overlap is not allowed.
	  function conflictingCollapsedRange(doc, lineNo, from, to, marker) {
	    var line = getLine(doc, lineNo);
	    var sps = sawCollapsedSpans && line.markedSpans;
	    if (sps) for (var i = 0; i < sps.length; ++i) {
	      var sp = sps[i];
	      if (!sp.marker.collapsed) continue;
	      var found = sp.marker.find(0);
	      var fromCmp = cmp(found.from, from) || extraLeft(sp.marker) - extraLeft(marker);
	      var toCmp = cmp(found.to, to) || extraRight(sp.marker) - extraRight(marker);
	      if (fromCmp >= 0 && toCmp <= 0 || fromCmp <= 0 && toCmp >= 0) continue;
	      if (fromCmp <= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.to, from) >= 0 : cmp(found.to, from) > 0) ||
	          fromCmp >= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.from, to) <= 0 : cmp(found.from, to) < 0))
	        return true;
	    }
	  }

	  // A visual line is a line as drawn on the screen. Folding, for
	  // example, can cause multiple logical lines to appear on the same
	  // visual line. This finds the start of the visual line that the
	  // given line is part of (usually that is the line itself).
	  function visualLine(line) {
	    var merged;
	    while (merged = collapsedSpanAtStart(line))
	      line = merged.find(-1, true).line;
	    return line;
	  }

	  // Returns an array of logical lines that continue the visual line
	  // started by the argument, or undefined if there are no such lines.
	  function visualLineContinued(line) {
	    var merged, lines;
	    while (merged = collapsedSpanAtEnd(line)) {
	      line = merged.find(1, true).line;
	      (lines || (lines = [])).push(line);
	    }
	    return lines;
	  }

	  // Get the line number of the start of the visual line that the
	  // given line number is part of.
	  function visualLineNo(doc, lineN) {
	    var line = getLine(doc, lineN), vis = visualLine(line);
	    if (line == vis) return lineN;
	    return lineNo(vis);
	  }
	  // Get the line number of the start of the next visual line after
	  // the given line.
	  function visualLineEndNo(doc, lineN) {
	    if (lineN > doc.lastLine()) return lineN;
	    var line = getLine(doc, lineN), merged;
	    if (!lineIsHidden(doc, line)) return lineN;
	    while (merged = collapsedSpanAtEnd(line))
	      line = merged.find(1, true).line;
	    return lineNo(line) + 1;
	  }

	  // Compute whether a line is hidden. Lines count as hidden when they
	  // are part of a visual line that starts with another line, or when
	  // they are entirely covered by collapsed, non-widget span.
	  function lineIsHidden(doc, line) {
	    var sps = sawCollapsedSpans && line.markedSpans;
	    if (sps) for (var sp, i = 0; i < sps.length; ++i) {
	      sp = sps[i];
	      if (!sp.marker.collapsed) continue;
	      if (sp.from == null) return true;
	      if (sp.marker.widgetNode) continue;
	      if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp))
	        return true;
	    }
	  }
	  function lineIsHiddenInner(doc, line, span) {
	    if (span.to == null) {
	      var end = span.marker.find(1, true);
	      return lineIsHiddenInner(doc, end.line, getMarkedSpanFor(end.line.markedSpans, span.marker));
	    }
	    if (span.marker.inclusiveRight && span.to == line.text.length)
	      return true;
	    for (var sp, i = 0; i < line.markedSpans.length; ++i) {
	      sp = line.markedSpans[i];
	      if (sp.marker.collapsed && !sp.marker.widgetNode && sp.from == span.to &&
	          (sp.to == null || sp.to != span.from) &&
	          (sp.marker.inclusiveLeft || span.marker.inclusiveRight) &&
	          lineIsHiddenInner(doc, line, sp)) return true;
	    }
	  }

	  // LINE WIDGETS

	  // Line widgets are block elements displayed above or below a line.

	  var LineWidget = CodeMirror.LineWidget = function(doc, node, options) {
	    if (options) for (var opt in options) if (options.hasOwnProperty(opt))
	      this[opt] = options[opt];
	    this.doc = doc;
	    this.node = node;
	  };
	  eventMixin(LineWidget);

	  function adjustScrollWhenAboveVisible(cm, line, diff) {
	    if (heightAtLine(line) < ((cm.curOp && cm.curOp.scrollTop) || cm.doc.scrollTop))
	      addToScrollPos(cm, null, diff);
	  }

	  LineWidget.prototype.clear = function() {
	    var cm = this.doc.cm, ws = this.line.widgets, line = this.line, no = lineNo(line);
	    if (no == null || !ws) return;
	    for (var i = 0; i < ws.length; ++i) if (ws[i] == this) ws.splice(i--, 1);
	    if (!ws.length) line.widgets = null;
	    var height = widgetHeight(this);
	    updateLineHeight(line, Math.max(0, line.height - height));
	    if (cm) runInOp(cm, function() {
	      adjustScrollWhenAboveVisible(cm, line, -height);
	      regLineChange(cm, no, "widget");
	    });
	  };
	  LineWidget.prototype.changed = function() {
	    var oldH = this.height, cm = this.doc.cm, line = this.line;
	    this.height = null;
	    var diff = widgetHeight(this) - oldH;
	    if (!diff) return;
	    updateLineHeight(line, line.height + diff);
	    if (cm) runInOp(cm, function() {
	      cm.curOp.forceUpdate = true;
	      adjustScrollWhenAboveVisible(cm, line, diff);
	    });
	  };

	  function widgetHeight(widget) {
	    if (widget.height != null) return widget.height;
	    var cm = widget.doc.cm;
	    if (!cm) return 0;
	    if (!contains(document.body, widget.node)) {
	      var parentStyle = "position: relative;";
	      if (widget.coverGutter)
	        parentStyle += "margin-left: -" + cm.display.gutters.offsetWidth + "px;";
	      if (widget.noHScroll)
	        parentStyle += "width: " + cm.display.wrapper.clientWidth + "px;";
	      removeChildrenAndAdd(cm.display.measure, elt("div", [widget.node], null, parentStyle));
	    }
	    return widget.height = widget.node.parentNode.offsetHeight;
	  }

	  function addLineWidget(doc, handle, node, options) {
	    var widget = new LineWidget(doc, node, options);
	    var cm = doc.cm;
	    if (cm && widget.noHScroll) cm.display.alignWidgets = true;
	    changeLine(doc, handle, "widget", function(line) {
	      var widgets = line.widgets || (line.widgets = []);
	      if (widget.insertAt == null) widgets.push(widget);
	      else widgets.splice(Math.min(widgets.length - 1, Math.max(0, widget.insertAt)), 0, widget);
	      widget.line = line;
	      if (cm && !lineIsHidden(doc, line)) {
	        var aboveVisible = heightAtLine(line) < doc.scrollTop;
	        updateLineHeight(line, line.height + widgetHeight(widget));
	        if (aboveVisible) addToScrollPos(cm, null, widget.height);
	        cm.curOp.forceUpdate = true;
	      }
	      return true;
	    });
	    return widget;
	  }

	  // LINE DATA STRUCTURE

	  // Line objects. These hold state related to a line, including
	  // highlighting info (the styles array).
	  var Line = CodeMirror.Line = function(text, markedSpans, estimateHeight) {
	    this.text = text;
	    attachMarkedSpans(this, markedSpans);
	    this.height = estimateHeight ? estimateHeight(this) : 1;
	  };
	  eventMixin(Line);
	  Line.prototype.lineNo = function() { return lineNo(this); };

	  // Change the content (text, markers) of a line. Automatically
	  // invalidates cached information and tries to re-estimate the
	  // line's height.
	  function updateLine(line, text, markedSpans, estimateHeight) {
	    line.text = text;
	    if (line.stateAfter) line.stateAfter = null;
	    if (line.styles) line.styles = null;
	    if (line.order != null) line.order = null;
	    detachMarkedSpans(line);
	    attachMarkedSpans(line, markedSpans);
	    var estHeight = estimateHeight ? estimateHeight(line) : 1;
	    if (estHeight != line.height) updateLineHeight(line, estHeight);
	  }

	  // Detach a line from the document tree and its markers.
	  function cleanUpLine(line) {
	    line.parent = null;
	    detachMarkedSpans(line);
	  }

	  function extractLineClasses(type, output) {
	    if (type) for (;;) {
	      var lineClass = type.match(/(?:^|\s+)line-(background-)?(\S+)/);
	      if (!lineClass) break;
	      type = type.slice(0, lineClass.index) + type.slice(lineClass.index + lineClass[0].length);
	      var prop = lineClass[1] ? "bgClass" : "textClass";
	      if (output[prop] == null)
	        output[prop] = lineClass[2];
	      else if (!(new RegExp("(?:^|\s)" + lineClass[2] + "(?:$|\s)")).test(output[prop]))
	        output[prop] += " " + lineClass[2];
	    }
	    return type;
	  }

	  function callBlankLine(mode, state) {
	    if (mode.blankLine) return mode.blankLine(state);
	    if (!mode.innerMode) return;
	    var inner = CodeMirror.innerMode(mode, state);
	    if (inner.mode.blankLine) return inner.mode.blankLine(inner.state);
	  }

	  function readToken(mode, stream, state, inner) {
	    for (var i = 0; i < 10; i++) {
	      if (inner) inner[0] = CodeMirror.innerMode(mode, state).mode;
	      var style = mode.token(stream, state);
	      if (stream.pos > stream.start) return style;
	    }
	    throw new Error("Mode " + mode.name + " failed to advance stream.");
	  }

	  // Utility for getTokenAt and getLineTokens
	  function takeToken(cm, pos, precise, asArray) {
	    function getObj(copy) {
	      return {start: stream.start, end: stream.pos,
	              string: stream.current(),
	              type: style || null,
	              state: copy ? copyState(doc.mode, state) : state};
	    }

	    var doc = cm.doc, mode = doc.mode, style;
	    pos = clipPos(doc, pos);
	    var line = getLine(doc, pos.line), state = getStateBefore(cm, pos.line, precise);
	    var stream = new StringStream(line.text, cm.options.tabSize), tokens;
	    if (asArray) tokens = [];
	    while ((asArray || stream.pos < pos.ch) && !stream.eol()) {
	      stream.start = stream.pos;
	      style = readToken(mode, stream, state);
	      if (asArray) tokens.push(getObj(true));
	    }
	    return asArray ? tokens : getObj();
	  }

	  // Run the given mode's parser over a line, calling f for each token.
	  function runMode(cm, text, mode, state, f, lineClasses, forceToEnd) {
	    var flattenSpans = mode.flattenSpans;
	    if (flattenSpans == null) flattenSpans = cm.options.flattenSpans;
	    var curStart = 0, curStyle = null;
	    var stream = new StringStream(text, cm.options.tabSize), style;
	    var inner = cm.options.addModeClass && [null];
	    if (text == "") extractLineClasses(callBlankLine(mode, state), lineClasses);
	    while (!stream.eol()) {
	      if (stream.pos > cm.options.maxHighlightLength) {
	        flattenSpans = false;
	        if (forceToEnd) processLine(cm, text, state, stream.pos);
	        stream.pos = text.length;
	        style = null;
	      } else {
	        style = extractLineClasses(readToken(mode, stream, state, inner), lineClasses);
	      }
	      if (inner) {
	        var mName = inner[0].name;
	        if (mName) style = "m-" + (style ? mName + " " + style : mName);
	      }
	      if (!flattenSpans || curStyle != style) {
	        while (curStart < stream.start) {
	          curStart = Math.min(stream.start, curStart + 50000);
	          f(curStart, curStyle);
	        }
	        curStyle = style;
	      }
	      stream.start = stream.pos;
	    }
	    while (curStart < stream.pos) {
	      // Webkit seems to refuse to render text nodes longer than 57444 characters
	      var pos = Math.min(stream.pos, curStart + 50000);
	      f(pos, curStyle);
	      curStart = pos;
	    }
	  }

	  // Compute a style array (an array starting with a mode generation
	  // -- for invalidation -- followed by pairs of end positions and
	  // style strings), which is used to highlight the tokens on the
	  // line.
	  function highlightLine(cm, line, state, forceToEnd) {
	    // A styles array always starts with a number identifying the
	    // mode/overlays that it is based on (for easy invalidation).
	    var st = [cm.state.modeGen], lineClasses = {};
	    // Compute the base array of styles
	    runMode(cm, line.text, cm.doc.mode, state, function(end, style) {
	      st.push(end, style);
	    }, lineClasses, forceToEnd);

	    // Run overlays, adjust style array.
	    for (var o = 0; o < cm.state.overlays.length; ++o) {
	      var overlay = cm.state.overlays[o], i = 1, at = 0;
	      runMode(cm, line.text, overlay.mode, true, function(end, style) {
	        var start = i;
	        // Ensure there's a token end at the current position, and that i points at it
	        while (at < end) {
	          var i_end = st[i];
	          if (i_end > end)
	            st.splice(i, 1, end, st[i+1], i_end);
	          i += 2;
	          at = Math.min(end, i_end);
	        }
	        if (!style) return;
	        if (overlay.opaque) {
	          st.splice(start, i - start, end, "cm-overlay " + style);
	          i = start + 2;
	        } else {
	          for (; start < i; start += 2) {
	            var cur = st[start+1];
	            st[start+1] = (cur ? cur + " " : "") + "cm-overlay " + style;
	          }
	        }
	      }, lineClasses);
	    }

	    return {styles: st, classes: lineClasses.bgClass || lineClasses.textClass ? lineClasses : null};
	  }

	  function getLineStyles(cm, line, updateFrontier) {
	    if (!line.styles || line.styles[0] != cm.state.modeGen) {
	      var state = getStateBefore(cm, lineNo(line));
	      var result = highlightLine(cm, line, line.text.length > cm.options.maxHighlightLength ? copyState(cm.doc.mode, state) : state);
	      line.stateAfter = state;
	      line.styles = result.styles;
	      if (result.classes) line.styleClasses = result.classes;
	      else if (line.styleClasses) line.styleClasses = null;
	      if (updateFrontier === cm.doc.frontier) cm.doc.frontier++;
	    }
	    return line.styles;
	  }

	  // Lightweight form of highlight -- proceed over this line and
	  // update state, but don't save a style array. Used for lines that
	  // aren't currently visible.
	  function processLine(cm, text, state, startAt) {
	    var mode = cm.doc.mode;
	    var stream = new StringStream(text, cm.options.tabSize);
	    stream.start = stream.pos = startAt || 0;
	    if (text == "") callBlankLine(mode, state);
	    while (!stream.eol()) {
	      readToken(mode, stream, state);
	      stream.start = stream.pos;
	    }
	  }

	  // Convert a style as returned by a mode (either null, or a string
	  // containing one or more styles) to a CSS style. This is cached,
	  // and also looks for line-wide styles.
	  var styleToClassCache = {}, styleToClassCacheWithMode = {};
	  function interpretTokenStyle(style, options) {
	    if (!style || /^\s*$/.test(style)) return null;
	    var cache = options.addModeClass ? styleToClassCacheWithMode : styleToClassCache;
	    return cache[style] ||
	      (cache[style] = style.replace(/\S+/g, "cm-$&"));
	  }

	  // Render the DOM representation of the text of a line. Also builds
	  // up a 'line map', which points at the DOM nodes that represent
	  // specific stretches of text, and is used by the measuring code.
	  // The returned object contains the DOM node, this map, and
	  // information about line-wide styles that were set by the mode.
	  function buildLineContent(cm, lineView) {
	    // The padding-right forces the element to have a 'border', which
	    // is needed on Webkit to be able to get line-level bounding
	    // rectangles for it (in measureChar).
	    var content = elt("span", null, null, webkit ? "padding-right: .1px" : null);
	    var builder = {pre: elt("pre", [content], "CodeMirror-line"), content: content,
	                   col: 0, pos: 0, cm: cm,
	                   trailingSpace: false,
	                   splitSpaces: (ie || webkit) && cm.getOption("lineWrapping")};
	    lineView.measure = {};

	    // Iterate over the logical lines that make up this visual line.
	    for (var i = 0; i <= (lineView.rest ? lineView.rest.length : 0); i++) {
	      var line = i ? lineView.rest[i - 1] : lineView.line, order;
	      builder.pos = 0;
	      builder.addToken = buildToken;
	      // Optionally wire in some hacks into the token-rendering
	      // algorithm, to deal with browser quirks.
	      if (hasBadBidiRects(cm.display.measure) && (order = getOrder(line)))
	        builder.addToken = buildTokenBadBidi(builder.addToken, order);
	      builder.map = [];
	      var allowFrontierUpdate = lineView != cm.display.externalMeasured && lineNo(line);
	      insertLineContent(line, builder, getLineStyles(cm, line, allowFrontierUpdate));
	      if (line.styleClasses) {
	        if (line.styleClasses.bgClass)
	          builder.bgClass = joinClasses(line.styleClasses.bgClass, builder.bgClass || "");
	        if (line.styleClasses.textClass)
	          builder.textClass = joinClasses(line.styleClasses.textClass, builder.textClass || "");
	      }

	      // Ensure at least a single node is present, for measuring.
	      if (builder.map.length == 0)
	        builder.map.push(0, 0, builder.content.appendChild(zeroWidthElement(cm.display.measure)));

	      // Store the map and a cache object for the current logical line
	      if (i == 0) {
	        lineView.measure.map = builder.map;
	        lineView.measure.cache = {};
	      } else {
	        (lineView.measure.maps || (lineView.measure.maps = [])).push(builder.map);
	        (lineView.measure.caches || (lineView.measure.caches = [])).push({});
	      }
	    }

	    // See issue #2901
	    if (webkit) {
	      var last = builder.content.lastChild
	      if (/\bcm-tab\b/.test(last.className) || (last.querySelector && last.querySelector(".cm-tab")))
	        builder.content.className = "cm-tab-wrap-hack";
	    }

	    signal(cm, "renderLine", cm, lineView.line, builder.pre);
	    if (builder.pre.className)
	      builder.textClass = joinClasses(builder.pre.className, builder.textClass || "");

	    return builder;
	  }

	  function defaultSpecialCharPlaceholder(ch) {
	    var token = elt("span", "\u2022", "cm-invalidchar");
	    token.title = "\\u" + ch.charCodeAt(0).toString(16);
	    token.setAttribute("aria-label", token.title);
	    return token;
	  }

	  // Build up the DOM representation for a single token, and add it to
	  // the line map. Takes care to render special characters separately.
	  function buildToken(builder, text, style, startStyle, endStyle, title, css) {
	    if (!text) return;
	    var displayText = builder.splitSpaces ? splitSpaces(text, builder.trailingSpace) : text
	    var special = builder.cm.state.specialChars, mustWrap = false;
	    if (!special.test(text)) {
	      builder.col += text.length;
	      var content = document.createTextNode(displayText);
	      builder.map.push(builder.pos, builder.pos + text.length, content);
	      if (ie && ie_version < 9) mustWrap = true;
	      builder.pos += text.length;
	    } else {
	      var content = document.createDocumentFragment(), pos = 0;
	      while (true) {
	        special.lastIndex = pos;
	        var m = special.exec(text);
	        var skipped = m ? m.index - pos : text.length - pos;
	        if (skipped) {
	          var txt = document.createTextNode(displayText.slice(pos, pos + skipped));
	          if (ie && ie_version < 9) content.appendChild(elt("span", [txt]));
	          else content.appendChild(txt);
	          builder.map.push(builder.pos, builder.pos + skipped, txt);
	          builder.col += skipped;
	          builder.pos += skipped;
	        }
	        if (!m) break;
	        pos += skipped + 1;
	        if (m[0] == "\t") {
	          var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
	          var txt = content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"));
	          txt.setAttribute("role", "presentation");
	          txt.setAttribute("cm-text", "\t");
	          builder.col += tabWidth;
	        } else if (m[0] == "\r" || m[0] == "\n") {
	          var txt = content.appendChild(elt("span", m[0] == "\r" ? "\u240d" : "\u2424", "cm-invalidchar"));
	          txt.setAttribute("cm-text", m[0]);
	          builder.col += 1;
	        } else {
	          var txt = builder.cm.options.specialCharPlaceholder(m[0]);
	          txt.setAttribute("cm-text", m[0]);
	          if (ie && ie_version < 9) content.appendChild(elt("span", [txt]));
	          else content.appendChild(txt);
	          builder.col += 1;
	        }
	        builder.map.push(builder.pos, builder.pos + 1, txt);
	        builder.pos++;
	      }
	    }
	    builder.trailingSpace = displayText.charCodeAt(text.length - 1) == 32
	    if (style || startStyle || endStyle || mustWrap || css) {
	      var fullStyle = style || "";
	      if (startStyle) fullStyle += startStyle;
	      if (endStyle) fullStyle += endStyle;
	      var token = elt("span", [content], fullStyle, css);
	      if (title) token.title = title;
	      return builder.content.appendChild(token);
	    }
	    builder.content.appendChild(content);
	  }

	  function splitSpaces(text, trailingBefore) {
	    if (text.length > 1 && !/  /.test(text)) return text
	    var spaceBefore = trailingBefore, result = ""
	    for (var i = 0; i < text.length; i++) {
	      var ch = text.charAt(i)
	      if (ch == " " && spaceBefore && (i == text.length - 1 || text.charCodeAt(i + 1) == 32))
	        ch = "\u00a0"
	      result += ch
	      spaceBefore = ch == " "
	    }
	    return result
	  }

	  // Work around nonsense dimensions being reported for stretches of
	  // right-to-left text.
	  function buildTokenBadBidi(inner, order) {
	    return function(builder, text, style, startStyle, endStyle, title, css) {
	      style = style ? style + " cm-force-border" : "cm-force-border";
	      var start = builder.pos, end = start + text.length;
	      for (;;) {
	        // Find the part that overlaps with the start of this text
	        for (var i = 0; i < order.length; i++) {
	          var part = order[i];
	          if (part.to > start && part.from <= start) break;
	        }
	        if (part.to >= end) return inner(builder, text, style, startStyle, endStyle, title, css);
	        inner(builder, text.slice(0, part.to - start), style, startStyle, null, title, css);
	        startStyle = null;
	        text = text.slice(part.to - start);
	        start = part.to;
	      }
	    };
	  }

	  function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
	    var widget = !ignoreWidget && marker.widgetNode;
	    if (widget) builder.map.push(builder.pos, builder.pos + size, widget);
	    if (!ignoreWidget && builder.cm.display.input.needsContentAttribute) {
	      if (!widget)
	        widget = builder.content.appendChild(document.createElement("span"));
	      widget.setAttribute("cm-marker", marker.id);
	    }
	    if (widget) {
	      builder.cm.display.input.setUneditable(widget);
	      builder.content.appendChild(widget);
	    }
	    builder.pos += size;
	    builder.trailingSpace = false
	  }

	  // Outputs a number of spans to make up a line, taking highlighting
	  // and marked text into account.
	  function insertLineContent(line, builder, styles) {
	    var spans = line.markedSpans, allText = line.text, at = 0;
	    if (!spans) {
	      for (var i = 1; i < styles.length; i+=2)
	        builder.addToken(builder, allText.slice(at, at = styles[i]), interpretTokenStyle(styles[i+1], builder.cm.options));
	      return;
	    }

	    var len = allText.length, pos = 0, i = 1, text = "", style, css;
	    var nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, title, collapsed;
	    for (;;) {
	      if (nextChange == pos) { // Update current marker set
	        spanStyle = spanEndStyle = spanStartStyle = title = css = "";
	        collapsed = null; nextChange = Infinity;
	        var foundBookmarks = [], endStyles
	        for (var j = 0; j < spans.length; ++j) {
	          var sp = spans[j], m = sp.marker;
	          if (m.type == "bookmark" && sp.from == pos && m.widgetNode) {
	            foundBookmarks.push(m);
	          } else if (sp.from <= pos && (sp.to == null || sp.to > pos || m.collapsed && sp.to == pos && sp.from == pos)) {
	            if (sp.to != null && sp.to != pos && nextChange > sp.to) {
	              nextChange = sp.to;
	              spanEndStyle = "";
	            }
	            if (m.className) spanStyle += " " + m.className;
	            if (m.css) css = (css ? css + ";" : "") + m.css;
	            if (m.startStyle && sp.from == pos) spanStartStyle += " " + m.startStyle;
	            if (m.endStyle && sp.to == nextChange) (endStyles || (endStyles = [])).push(m.endStyle, sp.to)
	            if (m.title && !title) title = m.title;
	            if (m.collapsed && (!collapsed || compareCollapsedMarkers(collapsed.marker, m) < 0))
	              collapsed = sp;
	          } else if (sp.from > pos && nextChange > sp.from) {
	            nextChange = sp.from;
	          }
	        }
	        if (endStyles) for (var j = 0; j < endStyles.length; j += 2)
	          if (endStyles[j + 1] == nextChange) spanEndStyle += " " + endStyles[j]

	        if (!collapsed || collapsed.from == pos) for (var j = 0; j < foundBookmarks.length; ++j)
	          buildCollapsedSpan(builder, 0, foundBookmarks[j]);
	        if (collapsed && (collapsed.from || 0) == pos) {
	          buildCollapsedSpan(builder, (collapsed.to == null ? len + 1 : collapsed.to) - pos,
	                             collapsed.marker, collapsed.from == null);
	          if (collapsed.to == null) return;
	          if (collapsed.to == pos) collapsed = false;
	        }
	      }
	      if (pos >= len) break;

	      var upto = Math.min(len, nextChange);
	      while (true) {
	        if (text) {
	          var end = pos + text.length;
	          if (!collapsed) {
	            var tokenText = end > upto ? text.slice(0, upto - pos) : text;
	            builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle,
	                             spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : "", title, css);
	          }
	          if (end >= upto) {text = text.slice(upto - pos); pos = upto; break;}
	          pos = end;
	          spanStartStyle = "";
	        }
	        text = allText.slice(at, at = styles[i++]);
	        style = interpretTokenStyle(styles[i++], builder.cm.options);
	      }
	    }
	  }

	  // DOCUMENT DATA STRUCTURE

	  // By default, updates that start and end at the beginning of a line
	  // are treated specially, in order to make the association of line
	  // widgets and marker elements with the text behave more intuitive.
	  function isWholeLineUpdate(doc, change) {
	    return change.from.ch == 0 && change.to.ch == 0 && lst(change.text) == "" &&
	      (!doc.cm || doc.cm.options.wholeLineUpdateBefore);
	  }

	  // Perform a change on the document data structure.
	  function updateDoc(doc, change, markedSpans, estimateHeight) {
	    function spansFor(n) {return markedSpans ? markedSpans[n] : null;}
	    function update(line, text, spans) {
	      updateLine(line, text, spans, estimateHeight);
	      signalLater(line, "change", line, change);
	    }
	    function linesFor(start, end) {
	      for (var i = start, result = []; i < end; ++i)
	        result.push(new Line(text[i], spansFor(i), estimateHeight));
	      return result;
	    }

	    var from = change.from, to = change.to, text = change.text;
	    var firstLine = getLine(doc, from.line), lastLine = getLine(doc, to.line);
	    var lastText = lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;

	    // Adjust the line structure
	    if (change.full) {
	      doc.insert(0, linesFor(0, text.length));
	      doc.remove(text.length, doc.size - text.length);
	    } else if (isWholeLineUpdate(doc, change)) {
	      // This is a whole-line replace. Treated specially to make
	      // sure line objects move the way they are supposed to.
	      var added = linesFor(0, text.length - 1);
	      update(lastLine, lastLine.text, lastSpans);
	      if (nlines) doc.remove(from.line, nlines);
	      if (added.length) doc.insert(from.line, added);
	    } else if (firstLine == lastLine) {
	      if (text.length == 1) {
	        update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
	      } else {
	        var added = linesFor(1, text.length - 1);
	        added.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight));
	        update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
	        doc.insert(from.line + 1, added);
	      }
	    } else if (text.length == 1) {
	      update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
	      doc.remove(from.line + 1, nlines);
	    } else {
	      update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
	      update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
	      var added = linesFor(1, text.length - 1);
	      if (nlines > 1) doc.remove(from.line + 1, nlines - 1);
	      doc.insert(from.line + 1, added);
	    }

	    signalLater(doc, "change", doc, change);
	  }

	  // The document is represented as a BTree consisting of leaves, with
	  // chunk of lines in them, and branches, with up to ten leaves or
	  // other branch nodes below them. The top node is always a branch
	  // node, and is the document object itself (meaning it has
	  // additional methods and properties).
	  //
	  // All nodes have parent links. The tree is used both to go from
	  // line numbers to line objects, and to go from objects to numbers.
	  // It also indexes by height, and is used to convert between height
	  // and line object, and to find the total height of the document.
	  //
	  // See also http://marijnhaverbeke.nl/blog/codemirror-line-tree.html

	  function LeafChunk(lines) {
	    this.lines = lines;
	    this.parent = null;
	    for (var i = 0, height = 0; i < lines.length; ++i) {
	      lines[i].parent = this;
	      height += lines[i].height;
	    }
	    this.height = height;
	  }

	  LeafChunk.prototype = {
	    chunkSize: function() { return this.lines.length; },
	    // Remove the n lines at offset 'at'.
	    removeInner: function(at, n) {
	      for (var i = at, e = at + n; i < e; ++i) {
	        var line = this.lines[i];
	        this.height -= line.height;
	        cleanUpLine(line);
	        signalLater(line, "delete");
	      }
	      this.lines.splice(at, n);
	    },
	    // Helper used to collapse a small branch into a single leaf.
	    collapse: function(lines) {
	      lines.push.apply(lines, this.lines);
	    },
	    // Insert the given array of lines at offset 'at', count them as
	    // having the given height.
	    insertInner: function(at, lines, height) {
	      this.height += height;
	      this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
	      for (var i = 0; i < lines.length; ++i) lines[i].parent = this;
	    },
	    // Used to iterate over a part of the tree.
	    iterN: function(at, n, op) {
	      for (var e = at + n; at < e; ++at)
	        if (op(this.lines[at])) return true;
	    }
	  };

	  function BranchChunk(children) {
	    this.children = children;
	    var size = 0, height = 0;
	    for (var i = 0; i < children.length; ++i) {
	      var ch = children[i];
	      size += ch.chunkSize(); height += ch.height;
	      ch.parent = this;
	    }
	    this.size = size;
	    this.height = height;
	    this.parent = null;
	  }

	  BranchChunk.prototype = {
	    chunkSize: function() { return this.size; },
	    removeInner: function(at, n) {
	      this.size -= n;
	      for (var i = 0; i < this.children.length; ++i) {
	        var child = this.children[i], sz = child.chunkSize();
	        if (at < sz) {
	          var rm = Math.min(n, sz - at), oldHeight = child.height;
	          child.removeInner(at, rm);
	          this.height -= oldHeight - child.height;
	          if (sz == rm) { this.children.splice(i--, 1); child.parent = null; }
	          if ((n -= rm) == 0) break;
	          at = 0;
	        } else at -= sz;
	      }
	      // If the result is smaller than 25 lines, ensure that it is a
	      // single leaf node.
	      if (this.size - n < 25 &&
	          (this.children.length > 1 || !(this.children[0] instanceof LeafChunk))) {
	        var lines = [];
	        this.collapse(lines);
	        this.children = [new LeafChunk(lines)];
	        this.children[0].parent = this;
	      }
	    },
	    collapse: function(lines) {
	      for (var i = 0; i < this.children.length; ++i) this.children[i].collapse(lines);
	    },
	    insertInner: function(at, lines, height) {
	      this.size += lines.length;
	      this.height += height;
	      for (var i = 0; i < this.children.length; ++i) {
	        var child = this.children[i], sz = child.chunkSize();
	        if (at <= sz) {
	          child.insertInner(at, lines, height);
	          if (child.lines && child.lines.length > 50) {
	            // To avoid memory thrashing when child.lines is huge (e.g. first view of a large file), it's never spliced.
	            // Instead, small slices are taken. They're taken in order because sequential memory accesses are fastest.
	            var remaining = child.lines.length % 25 + 25
	            for (var pos = remaining; pos < child.lines.length;) {
	              var leaf = new LeafChunk(child.lines.slice(pos, pos += 25));
	              child.height -= leaf.height;
	              this.children.splice(++i, 0, leaf);
	              leaf.parent = this;
	            }
	            child.lines = child.lines.slice(0, remaining);
	            this.maybeSpill();
	          }
	          break;
	        }
	        at -= sz;
	      }
	    },
	    // When a node has grown, check whether it should be split.
	    maybeSpill: function() {
	      if (this.children.length <= 10) return;
	      var me = this;
	      do {
	        var spilled = me.children.splice(me.children.length - 5, 5);
	        var sibling = new BranchChunk(spilled);
	        if (!me.parent) { // Become the parent node
	          var copy = new BranchChunk(me.children);
	          copy.parent = me;
	          me.children = [copy, sibling];
	          me = copy;
	       } else {
	          me.size -= sibling.size;
	          me.height -= sibling.height;
	          var myIndex = indexOf(me.parent.children, me);
	          me.parent.children.splice(myIndex + 1, 0, sibling);
	        }
	        sibling.parent = me.parent;
	      } while (me.children.length > 10);
	      me.parent.maybeSpill();
	    },
	    iterN: function(at, n, op) {
	      for (var i = 0; i < this.children.length; ++i) {
	        var child = this.children[i], sz = child.chunkSize();
	        if (at < sz) {
	          var used = Math.min(n, sz - at);
	          if (child.iterN(at, used, op)) return true;
	          if ((n -= used) == 0) break;
	          at = 0;
	        } else at -= sz;
	      }
	    }
	  };

	  var nextDocId = 0;
	  var Doc = CodeMirror.Doc = function(text, mode, firstLine, lineSep) {
	    if (!(this instanceof Doc)) return new Doc(text, mode, firstLine, lineSep);
	    if (firstLine == null) firstLine = 0;

	    BranchChunk.call(this, [new LeafChunk([new Line("", null)])]);
	    this.first = firstLine;
	    this.scrollTop = this.scrollLeft = 0;
	    this.cantEdit = false;
	    this.cleanGeneration = 1;
	    this.frontier = firstLine;
	    var start = Pos(firstLine, 0);
	    this.sel = simpleSelection(start);
	    this.history = new History(null);
	    this.id = ++nextDocId;
	    this.modeOption = mode;
	    this.lineSep = lineSep;
	    this.extend = false;

	    if (typeof text == "string") text = this.splitLines(text);
	    updateDoc(this, {from: start, to: start, text: text});
	    setSelection(this, simpleSelection(start), sel_dontScroll);
	  };

	  Doc.prototype = createObj(BranchChunk.prototype, {
	    constructor: Doc,
	    // Iterate over the document. Supports two forms -- with only one
	    // argument, it calls that for each line in the document. With
	    // three, it iterates over the range given by the first two (with
	    // the second being non-inclusive).
	    iter: function(from, to, op) {
	      if (op) this.iterN(from - this.first, to - from, op);
	      else this.iterN(this.first, this.first + this.size, from);
	    },

	    // Non-public interface for adding and removing lines.
	    insert: function(at, lines) {
	      var height = 0;
	      for (var i = 0; i < lines.length; ++i) height += lines[i].height;
	      this.insertInner(at - this.first, lines, height);
	    },
	    remove: function(at, n) { this.removeInner(at - this.first, n); },

	    // From here, the methods are part of the public interface. Most
	    // are also available from CodeMirror (editor) instances.

	    getValue: function(lineSep) {
	      var lines = getLines(this, this.first, this.first + this.size);
	      if (lineSep === false) return lines;
	      return lines.join(lineSep || this.lineSeparator());
	    },
	    setValue: docMethodOp(function(code) {
	      var top = Pos(this.first, 0), last = this.first + this.size - 1;
	      makeChange(this, {from: top, to: Pos(last, getLine(this, last).text.length),
	                        text: this.splitLines(code), origin: "setValue", full: true}, true);
	      setSelection(this, simpleSelection(top));
	    }),
	    replaceRange: function(code, from, to, origin) {
	      from = clipPos(this, from);
	      to = to ? clipPos(this, to) : from;
	      replaceRange(this, code, from, to, origin);
	    },
	    getRange: function(from, to, lineSep) {
	      var lines = getBetween(this, clipPos(this, from), clipPos(this, to));
	      if (lineSep === false) return lines;
	      return lines.join(lineSep || this.lineSeparator());
	    },

	    getLine: function(line) {var l = this.getLineHandle(line); return l && l.text;},

	    getLineHandle: function(line) {if (isLine(this, line)) return getLine(this, line);},
	    getLineNumber: function(line) {return lineNo(line);},

	    getLineHandleVisualStart: function(line) {
	      if (typeof line == "number") line = getLine(this, line);
	      return visualLine(line);
	    },

	    lineCount: function() {return this.size;},
	    firstLine: function() {return this.first;},
	    lastLine: function() {return this.first + this.size - 1;},

	    clipPos: function(pos) {return clipPos(this, pos);},

	    getCursor: function(start) {
	      var range = this.sel.primary(), pos;
	      if (start == null || start == "head") pos = range.head;
	      else if (start == "anchor") pos = range.anchor;
	      else if (start == "end" || start == "to" || start === false) pos = range.to();
	      else pos = range.from();
	      return pos;
	    },
	    listSelections: function() { return this.sel.ranges; },
	    somethingSelected: function() {return this.sel.somethingSelected();},

	    setCursor: docMethodOp(function(line, ch, options) {
	      setSimpleSelection(this, clipPos(this, typeof line == "number" ? Pos(line, ch || 0) : line), null, options);
	    }),
	    setSelection: docMethodOp(function(anchor, head, options) {
	      setSimpleSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), options);
	    }),
	    extendSelection: docMethodOp(function(head, other, options) {
	      extendSelection(this, clipPos(this, head), other && clipPos(this, other), options);
	    }),
	    extendSelections: docMethodOp(function(heads, options) {
	      extendSelections(this, clipPosArray(this, heads), options);
	    }),
	    extendSelectionsBy: docMethodOp(function(f, options) {
	      var heads = map(this.sel.ranges, f);
	      extendSelections(this, clipPosArray(this, heads), options);
	    }),
	    setSelections: docMethodOp(function(ranges, primary, options) {
	      if (!ranges.length) return;
	      for (var i = 0, out = []; i < ranges.length; i++)
	        out[i] = new Range(clipPos(this, ranges[i].anchor),
	                           clipPos(this, ranges[i].head));
	      if (primary == null) primary = Math.min(ranges.length - 1, this.sel.primIndex);
	      setSelection(this, normalizeSelection(out, primary), options);
	    }),
	    addSelection: docMethodOp(function(anchor, head, options) {
	      var ranges = this.sel.ranges.slice(0);
	      ranges.push(new Range(clipPos(this, anchor), clipPos(this, head || anchor)));
	      setSelection(this, normalizeSelection(ranges, ranges.length - 1), options);
	    }),

	    getSelection: function(lineSep) {
	      var ranges = this.sel.ranges, lines;
	      for (var i = 0; i < ranges.length; i++) {
	        var sel = getBetween(this, ranges[i].from(), ranges[i].to());
	        lines = lines ? lines.concat(sel) : sel;
	      }
	      if (lineSep === false) return lines;
	      else return lines.join(lineSep || this.lineSeparator());
	    },
	    getSelections: function(lineSep) {
	      var parts = [], ranges = this.sel.ranges;
	      for (var i = 0; i < ranges.length; i++) {
	        var sel = getBetween(this, ranges[i].from(), ranges[i].to());
	        if (lineSep !== false) sel = sel.join(lineSep || this.lineSeparator());
	        parts[i] = sel;
	      }
	      return parts;
	    },
	    replaceSelection: function(code, collapse, origin) {
	      var dup = [];
	      for (var i = 0; i < this.sel.ranges.length; i++)
	        dup[i] = code;
	      this.replaceSelections(dup, collapse, origin || "+input");
	    },
	    replaceSelections: docMethodOp(function(code, collapse, origin) {
	      var changes = [], sel = this.sel;
	      for (var i = 0; i < sel.ranges.length; i++) {
	        var range = sel.ranges[i];
	        changes[i] = {from: range.from(), to: range.to(), text: this.splitLines(code[i]), origin: origin};
	      }
	      var newSel = collapse && collapse != "end" && computeReplacedSel(this, changes, collapse);
	      for (var i = changes.length - 1; i >= 0; i--)
	        makeChange(this, changes[i]);
	      if (newSel) setSelectionReplaceHistory(this, newSel);
	      else if (this.cm) ensureCursorVisible(this.cm);
	    }),
	    undo: docMethodOp(function() {makeChangeFromHistory(this, "undo");}),
	    redo: docMethodOp(function() {makeChangeFromHistory(this, "redo");}),
	    undoSelection: docMethodOp(function() {makeChangeFromHistory(this, "undo", true);}),
	    redoSelection: docMethodOp(function() {makeChangeFromHistory(this, "redo", true);}),

	    setExtending: function(val) {this.extend = val;},
	    getExtending: function() {return this.extend;},

	    historySize: function() {
	      var hist = this.history, done = 0, undone = 0;
	      for (var i = 0; i < hist.done.length; i++) if (!hist.done[i].ranges) ++done;
	      for (var i = 0; i < hist.undone.length; i++) if (!hist.undone[i].ranges) ++undone;
	      return {undo: done, redo: undone};
	    },
	    clearHistory: function() {this.history = new History(this.history.maxGeneration);},

	    markClean: function() {
	      this.cleanGeneration = this.changeGeneration(true);
	    },
	    changeGeneration: function(forceSplit) {
	      if (forceSplit)
	        this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null;
	      return this.history.generation;
	    },
	    isClean: function (gen) {
	      return this.history.generation == (gen || this.cleanGeneration);
	    },

	    getHistory: function() {
	      return {done: copyHistoryArray(this.history.done),
	              undone: copyHistoryArray(this.history.undone)};
	    },
	    setHistory: function(histData) {
	      var hist = this.history = new History(this.history.maxGeneration);
	      hist.done = copyHistoryArray(histData.done.slice(0), null, true);
	      hist.undone = copyHistoryArray(histData.undone.slice(0), null, true);
	    },

	    addLineClass: docMethodOp(function(handle, where, cls) {
	      return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function(line) {
	        var prop = where == "text" ? "textClass"
	                 : where == "background" ? "bgClass"
	                 : where == "gutter" ? "gutterClass" : "wrapClass";
	        if (!line[prop]) line[prop] = cls;
	        else if (classTest(cls).test(line[prop])) return false;
	        else line[prop] += " " + cls;
	        return true;
	      });
	    }),
	    removeLineClass: docMethodOp(function(handle, where, cls) {
	      return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function(line) {
	        var prop = where == "text" ? "textClass"
	                 : where == "background" ? "bgClass"
	                 : where == "gutter" ? "gutterClass" : "wrapClass";
	        var cur = line[prop];
	        if (!cur) return false;
	        else if (cls == null) line[prop] = null;
	        else {
	          var found = cur.match(classTest(cls));
	          if (!found) return false;
	          var end = found.index + found[0].length;
	          line[prop] = cur.slice(0, found.index) + (!found.index || end == cur.length ? "" : " ") + cur.slice(end) || null;
	        }
	        return true;
	      });
	    }),

	    addLineWidget: docMethodOp(function(handle, node, options) {
	      return addLineWidget(this, handle, node, options);
	    }),
	    removeLineWidget: function(widget) { widget.clear(); },

	    markText: function(from, to, options) {
	      return markText(this, clipPos(this, from), clipPos(this, to), options, options && options.type || "range");
	    },
	    setBookmark: function(pos, options) {
	      var realOpts = {replacedWith: options && (options.nodeType == null ? options.widget : options),
	                      insertLeft: options && options.insertLeft,
	                      clearWhenEmpty: false, shared: options && options.shared,
	                      handleMouseEvents: options && options.handleMouseEvents};
	      pos = clipPos(this, pos);
	      return markText(this, pos, pos, realOpts, "bookmark");
	    },
	    findMarksAt: function(pos) {
	      pos = clipPos(this, pos);
	      var markers = [], spans = getLine(this, pos.line).markedSpans;
	      if (spans) for (var i = 0; i < spans.length; ++i) {
	        var span = spans[i];
	        if ((span.from == null || span.from <= pos.ch) &&
	            (span.to == null || span.to >= pos.ch))
	          markers.push(span.marker.parent || span.marker);
	      }
	      return markers;
	    },
	    findMarks: function(from, to, filter) {
	      from = clipPos(this, from); to = clipPos(this, to);
	      var found = [], lineNo = from.line;
	      this.iter(from.line, to.line + 1, function(line) {
	        var spans = line.markedSpans;
	        if (spans) for (var i = 0; i < spans.length; i++) {
	          var span = spans[i];
	          if (!(span.to != null && lineNo == from.line && from.ch >= span.to ||
	                span.from == null && lineNo != from.line ||
	                span.from != null && lineNo == to.line && span.from >= to.ch) &&
	              (!filter || filter(span.marker)))
	            found.push(span.marker.parent || span.marker);
	        }
	        ++lineNo;
	      });
	      return found;
	    },
	    getAllMarks: function() {
	      var markers = [];
	      this.iter(function(line) {
	        var sps = line.markedSpans;
	        if (sps) for (var i = 0; i < sps.length; ++i)
	          if (sps[i].from != null) markers.push(sps[i].marker);
	      });
	      return markers;
	    },

	    posFromIndex: function(off) {
	      var ch, lineNo = this.first, sepSize = this.lineSeparator().length;
	      this.iter(function(line) {
	        var sz = line.text.length + sepSize;
	        if (sz > off) { ch = off; return true; }
	        off -= sz;
	        ++lineNo;
	      });
	      return clipPos(this, Pos(lineNo, ch));
	    },
	    indexFromPos: function (coords) {
	      coords = clipPos(this, coords);
	      var index = coords.ch;
	      if (coords.line < this.first || coords.ch < 0) return 0;
	      var sepSize = this.lineSeparator().length;
	      this.iter(this.first, coords.line, function (line) {
	        index += line.text.length + sepSize;
	      });
	      return index;
	    },

	    copy: function(copyHistory) {
	      var doc = new Doc(getLines(this, this.first, this.first + this.size),
	                        this.modeOption, this.first, this.lineSep);
	      doc.scrollTop = this.scrollTop; doc.scrollLeft = this.scrollLeft;
	      doc.sel = this.sel;
	      doc.extend = false;
	      if (copyHistory) {
	        doc.history.undoDepth = this.history.undoDepth;
	        doc.setHistory(this.getHistory());
	      }
	      return doc;
	    },

	    linkedDoc: function(options) {
	      if (!options) options = {};
	      var from = this.first, to = this.first + this.size;
	      if (options.from != null && options.from > from) from = options.from;
	      if (options.to != null && options.to < to) to = options.to;
	      var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from, this.lineSep);
	      if (options.sharedHist) copy.history = this.history;
	      (this.linked || (this.linked = [])).push({doc: copy, sharedHist: options.sharedHist});
	      copy.linked = [{doc: this, isParent: true, sharedHist: options.sharedHist}];
	      copySharedMarkers(copy, findSharedMarkers(this));
	      return copy;
	    },
	    unlinkDoc: function(other) {
	      if (other instanceof CodeMirror) other = other.doc;
	      if (this.linked) for (var i = 0; i < this.linked.length; ++i) {
	        var link = this.linked[i];
	        if (link.doc != other) continue;
	        this.linked.splice(i, 1);
	        other.unlinkDoc(this);
	        detachSharedMarkers(findSharedMarkers(this));
	        break;
	      }
	      // If the histories were shared, split them again
	      if (other.history == this.history) {
	        var splitIds = [other.id];
	        linkedDocs(other, function(doc) {splitIds.push(doc.id);}, true);
	        other.history = new History(null);
	        other.history.done = copyHistoryArray(this.history.done, splitIds);
	        other.history.undone = copyHistoryArray(this.history.undone, splitIds);
	      }
	    },
	    iterLinkedDocs: function(f) {linkedDocs(this, f);},

	    getMode: function() {return this.mode;},
	    getEditor: function() {return this.cm;},

	    splitLines: function(str) {
	      if (this.lineSep) return str.split(this.lineSep);
	      return splitLinesAuto(str);
	    },
	    lineSeparator: function() { return this.lineSep || "\n"; }
	  });

	  // Public alias.
	  Doc.prototype.eachLine = Doc.prototype.iter;

	  // Set up methods on CodeMirror's prototype to redirect to the editor's document.
	  var dontDelegate = "iter insert remove copy getEditor constructor".split(" ");
	  for (var prop in Doc.prototype) if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0)
	    CodeMirror.prototype[prop] = (function(method) {
	      return function() {return method.apply(this.doc, arguments);};
	    })(Doc.prototype[prop]);

	  eventMixin(Doc);

	  // Call f for all linked documents.
	  function linkedDocs(doc, f, sharedHistOnly) {
	    function propagate(doc, skip, sharedHist) {
	      if (doc.linked) for (var i = 0; i < doc.linked.length; ++i) {
	        var rel = doc.linked[i];
	        if (rel.doc == skip) continue;
	        var shared = sharedHist && rel.sharedHist;
	        if (sharedHistOnly && !shared) continue;
	        f(rel.doc, shared);
	        propagate(rel.doc, doc, shared);
	      }
	    }
	    propagate(doc, null, true);
	  }

	  // Attach a document to an editor.
	  function attachDoc(cm, doc) {
	    if (doc.cm) throw new Error("This document is already in use.");
	    cm.doc = doc;
	    doc.cm = cm;
	    estimateLineHeights(cm);
	    loadMode(cm);
	    if (!cm.options.lineWrapping) findMaxLine(cm);
	    cm.options.mode = doc.modeOption;
	    regChange(cm);
	  }

	  // LINE UTILITIES

	  // Find the line object corresponding to the given line number.
	  function getLine(doc, n) {
	    n -= doc.first;
	    if (n < 0 || n >= doc.size) throw new Error("There is no line " + (n + doc.first) + " in the document.");
	    for (var chunk = doc; !chunk.lines;) {
	      for (var i = 0;; ++i) {
	        var child = chunk.children[i], sz = child.chunkSize();
	        if (n < sz) { chunk = child; break; }
	        n -= sz;
	      }
	    }
	    return chunk.lines[n];
	  }

	  // Get the part of a document between two positions, as an array of
	  // strings.
	  function getBetween(doc, start, end) {
	    var out = [], n = start.line;
	    doc.iter(start.line, end.line + 1, function(line) {
	      var text = line.text;
	      if (n == end.line) text = text.slice(0, end.ch);
	      if (n == start.line) text = text.slice(start.ch);
	      out.push(text);
	      ++n;
	    });
	    return out;
	  }
	  // Get the lines between from and to, as array of strings.
	  function getLines(doc, from, to) {
	    var out = [];
	    doc.iter(from, to, function(line) { out.push(line.text); });
	    return out;
	  }

	  // Update the height of a line, propagating the height change
	  // upwards to parent nodes.
	  function updateLineHeight(line, height) {
	    var diff = height - line.height;
	    if (diff) for (var n = line; n; n = n.parent) n.height += diff;
	  }

	  // Given a line object, find its line number by walking up through
	  // its parent links.
	  function lineNo(line) {
	    if (line.parent == null) return null;
	    var cur = line.parent, no = indexOf(cur.lines, line);
	    for (var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
	      for (var i = 0;; ++i) {
	        if (chunk.children[i] == cur) break;
	        no += chunk.children[i].chunkSize();
	      }
	    }
	    return no + cur.first;
	  }

	  // Find the line at the given vertical position, using the height
	  // information in the document tree.
	  function lineAtHeight(chunk, h) {
	    var n = chunk.first;
	    outer: do {
	      for (var i = 0; i < chunk.children.length; ++i) {
	        var child = chunk.children[i], ch = child.height;
	        if (h < ch) { chunk = child; continue outer; }
	        h -= ch;
	        n += child.chunkSize();
	      }
	      return n;
	    } while (!chunk.lines);
	    for (var i = 0; i < chunk.lines.length; ++i) {
	      var line = chunk.lines[i], lh = line.height;
	      if (h < lh) break;
	      h -= lh;
	    }
	    return n + i;
	  }


	  // Find the height above the given line.
	  function heightAtLine(lineObj) {
	    lineObj = visualLine(lineObj);

	    var h = 0, chunk = lineObj.parent;
	    for (var i = 0; i < chunk.lines.length; ++i) {
	      var line = chunk.lines[i];
	      if (line == lineObj) break;
	      else h += line.height;
	    }
	    for (var p = chunk.parent; p; chunk = p, p = chunk.parent) {
	      for (var i = 0; i < p.children.length; ++i) {
	        var cur = p.children[i];
	        if (cur == chunk) break;
	        else h += cur.height;
	      }
	    }
	    return h;
	  }

	  // Get the bidi ordering for the given line (and cache it). Returns
	  // false for lines that are fully left-to-right, and an array of
	  // BidiSpan objects otherwise.
	  function getOrder(line) {
	    var order = line.order;
	    if (order == null) order = line.order = bidiOrdering(line.text);
	    return order;
	  }

	  // HISTORY

	  function History(startGen) {
	    // Arrays of change events and selections. Doing something adds an
	    // event to done and clears undo. Undoing moves events from done
	    // to undone, redoing moves them in the other direction.
	    this.done = []; this.undone = [];
	    this.undoDepth = Infinity;
	    // Used to track when changes can be merged into a single undo
	    // event
	    this.lastModTime = this.lastSelTime = 0;
	    this.lastOp = this.lastSelOp = null;
	    this.lastOrigin = this.lastSelOrigin = null;
	    // Used by the isClean() method
	    this.generation = this.maxGeneration = startGen || 1;
	  }

	  // Create a history change event from an updateDoc-style change
	  // object.
	  function historyChangeFromChange(doc, change) {
	    var histChange = {from: copyPos(change.from), to: changeEnd(change), text: getBetween(doc, change.from, change.to)};
	    attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
	    linkedDocs(doc, function(doc) {attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);}, true);
	    return histChange;
	  }

	  // Pop all selection events off the end of a history array. Stop at
	  // a change event.
	  function clearSelectionEvents(array) {
	    while (array.length) {
	      var last = lst(array);
	      if (last.ranges) array.pop();
	      else break;
	    }
	  }

	  // Find the top change event in the history. Pop off selection
	  // events that are in the way.
	  function lastChangeEvent(hist, force) {
	    if (force) {
	      clearSelectionEvents(hist.done);
	      return lst(hist.done);
	    } else if (hist.done.length && !lst(hist.done).ranges) {
	      return lst(hist.done);
	    } else if (hist.done.length > 1 && !hist.done[hist.done.length - 2].ranges) {
	      hist.done.pop();
	      return lst(hist.done);
	    }
	  }

	  // Register a change in the history. Merges changes that are within
	  // a single operation, or are close together with an origin that
	  // allows merging (starting with "+") into a single event.
	  function addChangeToHistory(doc, change, selAfter, opId) {
	    var hist = doc.history;
	    hist.undone.length = 0;
	    var time = +new Date, cur;

	    if ((hist.lastOp == opId ||
	         hist.lastOrigin == change.origin && change.origin &&
	         ((change.origin.charAt(0) == "+" && doc.cm && hist.lastModTime > time - doc.cm.options.historyEventDelay) ||
	          change.origin.charAt(0) == "*")) &&
	        (cur = lastChangeEvent(hist, hist.lastOp == opId))) {
	      // Merge this change into the last event
	      var last = lst(cur.changes);
	      if (cmp(change.from, change.to) == 0 && cmp(change.from, last.to) == 0) {
	        // Optimized case for simple insertion -- don't want to add
	        // new changesets for every character typed
	        last.to = changeEnd(change);
	      } else {
	        // Add new sub-event
	        cur.changes.push(historyChangeFromChange(doc, change));
	      }
	    } else {
	      // Can not be merged, start a new event.
	      var before = lst(hist.done);
	      if (!before || !before.ranges)
	        pushSelectionToHistory(doc.sel, hist.done);
	      cur = {changes: [historyChangeFromChange(doc, change)],
	             generation: hist.generation};
	      hist.done.push(cur);
	      while (hist.done.length > hist.undoDepth) {
	        hist.done.shift();
	        if (!hist.done[0].ranges) hist.done.shift();
	      }
	    }
	    hist.done.push(selAfter);
	    hist.generation = ++hist.maxGeneration;
	    hist.lastModTime = hist.lastSelTime = time;
	    hist.lastOp = hist.lastSelOp = opId;
	    hist.lastOrigin = hist.lastSelOrigin = change.origin;

	    if (!last) signal(doc, "historyAdded");
	  }

	  function selectionEventCanBeMerged(doc, origin, prev, sel) {
	    var ch = origin.charAt(0);
	    return ch == "*" ||
	      ch == "+" &&
	      prev.ranges.length == sel.ranges.length &&
	      prev.somethingSelected() == sel.somethingSelected() &&
	      new Date - doc.history.lastSelTime <= (doc.cm ? doc.cm.options.historyEventDelay : 500);
	  }

	  // Called whenever the selection changes, sets the new selection as
	  // the pending selection in the history, and pushes the old pending
	  // selection into the 'done' array when it was significantly
	  // different (in number of selected ranges, emptiness, or time).
	  function addSelectionToHistory(doc, sel, opId, options) {
	    var hist = doc.history, origin = options && options.origin;

	    // A new event is started when the previous origin does not match
	    // the current, or the origins don't allow matching. Origins
	    // starting with * are always merged, those starting with + are
	    // merged when similar and close together in time.
	    if (opId == hist.lastSelOp ||
	        (origin && hist.lastSelOrigin == origin &&
	         (hist.lastModTime == hist.lastSelTime && hist.lastOrigin == origin ||
	          selectionEventCanBeMerged(doc, origin, lst(hist.done), sel))))
	      hist.done[hist.done.length - 1] = sel;
	    else
	      pushSelectionToHistory(sel, hist.done);

	    hist.lastSelTime = +new Date;
	    hist.lastSelOrigin = origin;
	    hist.lastSelOp = opId;
	    if (options && options.clearRedo !== false)
	      clearSelectionEvents(hist.undone);
	  }

	  function pushSelectionToHistory(sel, dest) {
	    var top = lst(dest);
	    if (!(top && top.ranges && top.equals(sel)))
	      dest.push(sel);
	  }

	  // Used to store marked span information in the history.
	  function attachLocalSpans(doc, change, from, to) {
	    var existing = change["spans_" + doc.id], n = 0;
	    doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), function(line) {
	      if (line.markedSpans)
	        (existing || (existing = change["spans_" + doc.id] = {}))[n] = line.markedSpans;
	      ++n;
	    });
	  }

	  // When un/re-doing restores text containing marked spans, those
	  // that have been explicitly cleared should not be restored.
	  function removeClearedSpans(spans) {
	    if (!spans) return null;
	    for (var i = 0, out; i < spans.length; ++i) {
	      if (spans[i].marker.explicitlyCleared) { if (!out) out = spans.slice(0, i); }
	      else if (out) out.push(spans[i]);
	    }
	    return !out ? spans : out.length ? out : null;
	  }

	  // Retrieve and filter the old marked spans stored in a change event.
	  function getOldSpans(doc, change) {
	    var found = change["spans_" + doc.id];
	    if (!found) return null;
	    for (var i = 0, nw = []; i < change.text.length; ++i)
	      nw.push(removeClearedSpans(found[i]));
	    return nw;
	  }

	  // Used both to provide a JSON-safe object in .getHistory, and, when
	  // detaching a document, to split the history in two
	  function copyHistoryArray(events, newGroup, instantiateSel) {
	    for (var i = 0, copy = []; i < events.length; ++i) {
	      var event = events[i];
	      if (event.ranges) {
	        copy.push(instantiateSel ? Selection.prototype.deepCopy.call(event) : event);
	        continue;
	      }
	      var changes = event.changes, newChanges = [];
	      copy.push({changes: newChanges});
	      for (var j = 0; j < changes.length; ++j) {
	        var change = changes[j], m;
	        newChanges.push({from: change.from, to: change.to, text: change.text});
	        if (newGroup) for (var prop in change) if (m = prop.match(/^spans_(\d+)$/)) {
	          if (indexOf(newGroup, Number(m[1])) > -1) {
	            lst(newChanges)[prop] = change[prop];
	            delete change[prop];
	          }
	        }
	      }
	    }
	    return copy;
	  }

	  // Rebasing/resetting history to deal with externally-sourced changes

	  function rebaseHistSelSingle(pos, from, to, diff) {
	    if (to < pos.line) {
	      pos.line += diff;
	    } else if (from < pos.line) {
	      pos.line = from;
	      pos.ch = 0;
	    }
	  }

	  // Tries to rebase an array of history events given a change in the
	  // document. If the change touches the same lines as the event, the
	  // event, and everything 'behind' it, is discarded. If the change is
	  // before the event, the event's positions are updated. Uses a
	  // copy-on-write scheme for the positions, to avoid having to
	  // reallocate them all on every rebase, but also avoid problems with
	  // shared position objects being unsafely updated.
	  function rebaseHistArray(array, from, to, diff) {
	    for (var i = 0; i < array.length; ++i) {
	      var sub = array[i], ok = true;
	      if (sub.ranges) {
	        if (!sub.copied) { sub = array[i] = sub.deepCopy(); sub.copied = true; }
	        for (var j = 0; j < sub.ranges.length; j++) {
	          rebaseHistSelSingle(sub.ranges[j].anchor, from, to, diff);
	          rebaseHistSelSingle(sub.ranges[j].head, from, to, diff);
	        }
	        continue;
	      }
	      for (var j = 0; j < sub.changes.length; ++j) {
	        var cur = sub.changes[j];
	        if (to < cur.from.line) {
	          cur.from = Pos(cur.from.line + diff, cur.from.ch);
	          cur.to = Pos(cur.to.line + diff, cur.to.ch);
	        } else if (from <= cur.to.line) {
	          ok = false;
	          break;
	        }
	      }
	      if (!ok) {
	        array.splice(0, i + 1);
	        i = 0;
	      }
	    }
	  }

	  function rebaseHist(hist, change) {
	    var from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;
	    rebaseHistArray(hist.done, from, to, diff);
	    rebaseHistArray(hist.undone, from, to, diff);
	  }

	  // EVENT UTILITIES

	  // Due to the fact that we still support jurassic IE versions, some
	  // compatibility wrappers are needed.

	  var e_preventDefault = CodeMirror.e_preventDefault = function(e) {
	    if (e.preventDefault) e.preventDefault();
	    else e.returnValue = false;
	  };
	  var e_stopPropagation = CodeMirror.e_stopPropagation = function(e) {
	    if (e.stopPropagation) e.stopPropagation();
	    else e.cancelBubble = true;
	  };
	  function e_defaultPrevented(e) {
	    return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
	  }
	  var e_stop = CodeMirror.e_stop = function(e) {e_preventDefault(e); e_stopPropagation(e);};

	  function e_target(e) {return e.target || e.srcElement;}
	  function e_button(e) {
	    var b = e.which;
	    if (b == null) {
	      if (e.button & 1) b = 1;
	      else if (e.button & 2) b = 3;
	      else if (e.button & 4) b = 2;
	    }
	    if (mac && e.ctrlKey && b == 1) b = 3;
	    return b;
	  }

	  // EVENT HANDLING

	  // Lightweight event framework. on/off also work on DOM nodes,
	  // registering native DOM handlers.

	  var on = CodeMirror.on = function(emitter, type, f) {
	    if (emitter.addEventListener)
	      emitter.addEventListener(type, f, false);
	    else if (emitter.attachEvent)
	      emitter.attachEvent("on" + type, f);
	    else {
	      var map = emitter._handlers || (emitter._handlers = {});
	      var arr = map[type] || (map[type] = []);
	      arr.push(f);
	    }
	  };

	  var noHandlers = []
	  function getHandlers(emitter, type, copy) {
	    var arr = emitter._handlers && emitter._handlers[type]
	    if (copy) return arr && arr.length > 0 ? arr.slice() : noHandlers
	    else return arr || noHandlers
	  }

	  var off = CodeMirror.off = function(emitter, type, f) {
	    if (emitter.removeEventListener)
	      emitter.removeEventListener(type, f, false);
	    else if (emitter.detachEvent)
	      emitter.detachEvent("on" + type, f);
	    else {
	      var handlers = getHandlers(emitter, type, false)
	      for (var i = 0; i < handlers.length; ++i)
	        if (handlers[i] == f) { handlers.splice(i, 1); break; }
	    }
	  };

	  var signal = CodeMirror.signal = function(emitter, type /*, values...*/) {
	    var handlers = getHandlers(emitter, type, true)
	    if (!handlers.length) return;
	    var args = Array.prototype.slice.call(arguments, 2);
	    for (var i = 0; i < handlers.length; ++i) handlers[i].apply(null, args);
	  };

	  var orphanDelayedCallbacks = null;

	  // Often, we want to signal events at a point where we are in the
	  // middle of some work, but don't want the handler to start calling
	  // other methods on the editor, which might be in an inconsistent
	  // state or simply not expect any other events to happen.
	  // signalLater looks whether there are any handlers, and schedules
	  // them to be executed when the last operation ends, or, if no
	  // operation is active, when a timeout fires.
	  function signalLater(emitter, type /*, values...*/) {
	    var arr = getHandlers(emitter, type, false)
	    if (!arr.length) return;
	    var args = Array.prototype.slice.call(arguments, 2), list;
	    if (operationGroup) {
	      list = operationGroup.delayedCallbacks;
	    } else if (orphanDelayedCallbacks) {
	      list = orphanDelayedCallbacks;
	    } else {
	      list = orphanDelayedCallbacks = [];
	      setTimeout(fireOrphanDelayed, 0);
	    }
	    function bnd(f) {return function(){f.apply(null, args);};};
	    for (var i = 0; i < arr.length; ++i)
	      list.push(bnd(arr[i]));
	  }

	  function fireOrphanDelayed() {
	    var delayed = orphanDelayedCallbacks;
	    orphanDelayedCallbacks = null;
	    for (var i = 0; i < delayed.length; ++i) delayed[i]();
	  }

	  // The DOM events that CodeMirror handles can be overridden by
	  // registering a (non-DOM) handler on the editor for the event name,
	  // and preventDefault-ing the event in that handler.
	  function signalDOMEvent(cm, e, override) {
	    if (typeof e == "string")
	      e = {type: e, preventDefault: function() { this.defaultPrevented = true; }};
	    signal(cm, override || e.type, cm, e);
	    return e_defaultPrevented(e) || e.codemirrorIgnore;
	  }

	  function signalCursorActivity(cm) {
	    var arr = cm._handlers && cm._handlers.cursorActivity;
	    if (!arr) return;
	    var set = cm.curOp.cursorActivityHandlers || (cm.curOp.cursorActivityHandlers = []);
	    for (var i = 0; i < arr.length; ++i) if (indexOf(set, arr[i]) == -1)
	      set.push(arr[i]);
	  }

	  function hasHandler(emitter, type) {
	    return getHandlers(emitter, type).length > 0
	  }

	  // Add on and off methods to a constructor's prototype, to make
	  // registering events on such objects more convenient.
	  function eventMixin(ctor) {
	    ctor.prototype.on = function(type, f) {on(this, type, f);};
	    ctor.prototype.off = function(type, f) {off(this, type, f);};
	  }

	  // MISC UTILITIES

	  // Number of pixels added to scroller and sizer to hide scrollbar
	  var scrollerGap = 30;

	  // Returned or thrown by various protocols to signal 'I'm not
	  // handling this'.
	  var Pass = CodeMirror.Pass = {toString: function(){return "CodeMirror.Pass";}};

	  // Reused option objects for setSelection & friends
	  var sel_dontScroll = {scroll: false}, sel_mouse = {origin: "*mouse"}, sel_move = {origin: "+move"};

	  function Delayed() {this.id = null;}
	  Delayed.prototype.set = function(ms, f) {
	    clearTimeout(this.id);
	    this.id = setTimeout(f, ms);
	  };

	  // Counts the column offset in a string, taking tabs into account.
	  // Used mostly to find indentation.
	  var countColumn = CodeMirror.countColumn = function(string, end, tabSize, startIndex, startValue) {
	    if (end == null) {
	      end = string.search(/[^\s\u00a0]/);
	      if (end == -1) end = string.length;
	    }
	    for (var i = startIndex || 0, n = startValue || 0;;) {
	      var nextTab = string.indexOf("\t", i);
	      if (nextTab < 0 || nextTab >= end)
	        return n + (end - i);
	      n += nextTab - i;
	      n += tabSize - (n % tabSize);
	      i = nextTab + 1;
	    }
	  };

	  // The inverse of countColumn -- find the offset that corresponds to
	  // a particular column.
	  var findColumn = CodeMirror.findColumn = function(string, goal, tabSize) {
	    for (var pos = 0, col = 0;;) {
	      var nextTab = string.indexOf("\t", pos);
	      if (nextTab == -1) nextTab = string.length;
	      var skipped = nextTab - pos;
	      if (nextTab == string.length || col + skipped >= goal)
	        return pos + Math.min(skipped, goal - col);
	      col += nextTab - pos;
	      col += tabSize - (col % tabSize);
	      pos = nextTab + 1;
	      if (col >= goal) return pos;
	    }
	  }

	  var spaceStrs = [""];
	  function spaceStr(n) {
	    while (spaceStrs.length <= n)
	      spaceStrs.push(lst(spaceStrs) + " ");
	    return spaceStrs[n];
	  }

	  function lst(arr) { return arr[arr.length-1]; }

	  var selectInput = function(node) { node.select(); };
	  if (ios) // Mobile Safari apparently has a bug where select() is broken.
	    selectInput = function(node) { node.selectionStart = 0; node.selectionEnd = node.value.length; };
	  else if (ie) // Suppress mysterious IE10 errors
	    selectInput = function(node) { try { node.select(); } catch(_e) {} };

	  function indexOf(array, elt) {
	    for (var i = 0; i < array.length; ++i)
	      if (array[i] == elt) return i;
	    return -1;
	  }
	  function map(array, f) {
	    var out = [];
	    for (var i = 0; i < array.length; i++) out[i] = f(array[i], i);
	    return out;
	  }

	  function insertSorted(array, value, score) {
	    var pos = 0, priority = score(value)
	    while (pos < array.length && score(array[pos]) <= priority) pos++
	    array.splice(pos, 0, value)
	  }

	  function nothing() {}

	  function createObj(base, props) {
	    var inst;
	    if (Object.create) {
	      inst = Object.create(base);
	    } else {
	      nothing.prototype = base;
	      inst = new nothing();
	    }
	    if (props) copyObj(props, inst);
	    return inst;
	  };

	  function copyObj(obj, target, overwrite) {
	    if (!target) target = {};
	    for (var prop in obj)
	      if (obj.hasOwnProperty(prop) && (overwrite !== false || !target.hasOwnProperty(prop)))
	        target[prop] = obj[prop];
	    return target;
	  }

	  function bind(f) {
	    var args = Array.prototype.slice.call(arguments, 1);
	    return function(){return f.apply(null, args);};
	  }

	  var nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
	  var isWordCharBasic = CodeMirror.isWordChar = function(ch) {
	    return /\w/.test(ch) || ch > "\x80" &&
	      (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
	  };
	  function isWordChar(ch, helper) {
	    if (!helper) return isWordCharBasic(ch);
	    if (helper.source.indexOf("\\w") > -1 && isWordCharBasic(ch)) return true;
	    return helper.test(ch);
	  }

	  function isEmpty(obj) {
	    for (var n in obj) if (obj.hasOwnProperty(n) && obj[n]) return false;
	    return true;
	  }

	  // Extending unicode characters. A series of a non-extending char +
	  // any number of extending chars is treated as a single unit as far
	  // as editing and measuring is concerned. This is not fully correct,
	  // since some scripts/fonts/browsers also treat other configurations
	  // of code points as a group.
	  var extendingChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
	  function isExtendingChar(ch) { return ch.charCodeAt(0) >= 768 && extendingChars.test(ch); }

	  // DOM UTILITIES

	  function elt(tag, content, className, style) {
	    var e = document.createElement(tag);
	    if (className) e.className = className;
	    if (style) e.style.cssText = style;
	    if (typeof content == "string") e.appendChild(document.createTextNode(content));
	    else if (content) for (var i = 0; i < content.length; ++i) e.appendChild(content[i]);
	    return e;
	  }

	  var range;
	  if (document.createRange) range = function(node, start, end, endNode) {
	    var r = document.createRange();
	    r.setEnd(endNode || node, end);
	    r.setStart(node, start);
	    return r;
	  };
	  else range = function(node, start, end) {
	    var r = document.body.createTextRange();
	    try { r.moveToElementText(node.parentNode); }
	    catch(e) { return r; }
	    r.collapse(true);
	    r.moveEnd("character", end);
	    r.moveStart("character", start);
	    return r;
	  };

	  function removeChildren(e) {
	    for (var count = e.childNodes.length; count > 0; --count)
	      e.removeChild(e.firstChild);
	    return e;
	  }

	  function removeChildrenAndAdd(parent, e) {
	    return removeChildren(parent).appendChild(e);
	  }

	  var contains = CodeMirror.contains = function(parent, child) {
	    if (child.nodeType == 3) // Android browser always returns false when child is a textnode
	      child = child.parentNode;
	    if (parent.contains)
	      return parent.contains(child);
	    do {
	      if (child.nodeType == 11) child = child.host;
	      if (child == parent) return true;
	    } while (child = child.parentNode);
	  };

	  function activeElt() {
	    var activeElement = document.activeElement;
	    while (activeElement && activeElement.root && activeElement.root.activeElement)
	      activeElement = activeElement.root.activeElement;
	    return activeElement;
	  }
	  // Older versions of IE throws unspecified error when touching
	  // document.activeElement in some cases (during loading, in iframe)
	  if (ie && ie_version < 11) activeElt = function() {
	    try { return document.activeElement; }
	    catch(e) { return document.body; }
	  };

	  function classTest(cls) { return new RegExp("(^|\\s)" + cls + "(?:$|\\s)\\s*"); }
	  var rmClass = CodeMirror.rmClass = function(node, cls) {
	    var current = node.className;
	    var match = classTest(cls).exec(current);
	    if (match) {
	      var after = current.slice(match.index + match[0].length);
	      node.className = current.slice(0, match.index) + (after ? match[1] + after : "");
	    }
	  };
	  var addClass = CodeMirror.addClass = function(node, cls) {
	    var current = node.className;
	    if (!classTest(cls).test(current)) node.className += (current ? " " : "") + cls;
	  };
	  function joinClasses(a, b) {
	    var as = a.split(" ");
	    for (var i = 0; i < as.length; i++)
	      if (as[i] && !classTest(as[i]).test(b)) b += " " + as[i];
	    return b;
	  }

	  // WINDOW-WIDE EVENTS

	  // These must be handled carefully, because naively registering a
	  // handler for each editor will cause the editors to never be
	  // garbage collected.

	  function forEachCodeMirror(f) {
	    if (!document.body.getElementsByClassName) return;
	    var byClass = document.body.getElementsByClassName("CodeMirror");
	    for (var i = 0; i < byClass.length; i++) {
	      var cm = byClass[i].CodeMirror;
	      if (cm) f(cm);
	    }
	  }

	  var globalsRegistered = false;
	  function ensureGlobalHandlers() {
	    if (globalsRegistered) return;
	    registerGlobalHandlers();
	    globalsRegistered = true;
	  }
	  function registerGlobalHandlers() {
	    // When the window resizes, we need to refresh active editors.
	    var resizeTimer;
	    on(window, "resize", function() {
	      if (resizeTimer == null) resizeTimer = setTimeout(function() {
	        resizeTimer = null;
	        forEachCodeMirror(onResize);
	      }, 100);
	    });
	    // When the window loses focus, we want to show the editor as blurred
	    on(window, "blur", function() {
	      forEachCodeMirror(onBlur);
	    });
	  }

	  // FEATURE DETECTION

	  // Detect drag-and-drop
	  var dragAndDrop = function() {
	    // There is *some* kind of drag-and-drop support in IE6-8, but I
	    // couldn't get it to work yet.
	    if (ie && ie_version < 9) return false;
	    var div = elt('div');
	    return "draggable" in div || "dragDrop" in div;
	  }();

	  var zwspSupported;
	  function zeroWidthElement(measure) {
	    if (zwspSupported == null) {
	      var test = elt("span", "\u200b");
	      removeChildrenAndAdd(measure, elt("span", [test, document.createTextNode("x")]));
	      if (measure.firstChild.offsetHeight != 0)
	        zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !(ie && ie_version < 8);
	    }
	    var node = zwspSupported ? elt("span", "\u200b") :
	      elt("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
	    node.setAttribute("cm-text", "");
	    return node;
	  }

	  // Feature-detect IE's crummy client rect reporting for bidi text
	  var badBidiRects;
	  function hasBadBidiRects(measure) {
	    if (badBidiRects != null) return badBidiRects;
	    var txt = removeChildrenAndAdd(measure, document.createTextNode("A\u062eA"));
	    var r0 = range(txt, 0, 1).getBoundingClientRect();
	    var r1 = range(txt, 1, 2).getBoundingClientRect();
	    removeChildren(measure);
	    if (!r0 || r0.left == r0.right) return false; // Safari returns null in some cases (#2780)
	    return badBidiRects = (r1.right - r0.right < 3);
	  }

	  // See if "".split is the broken IE version, if so, provide an
	  // alternative way to split lines.
	  var splitLinesAuto = CodeMirror.splitLines = "\n\nb".split(/\n/).length != 3 ? function(string) {
	    var pos = 0, result = [], l = string.length;
	    while (pos <= l) {
	      var nl = string.indexOf("\n", pos);
	      if (nl == -1) nl = string.length;
	      var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
	      var rt = line.indexOf("\r");
	      if (rt != -1) {
	        result.push(line.slice(0, rt));
	        pos += rt + 1;
	      } else {
	        result.push(line);
	        pos = nl + 1;
	      }
	    }
	    return result;
	  } : function(string){return string.split(/\r\n?|\n/);};

	  var hasSelection = window.getSelection ? function(te) {
	    try { return te.selectionStart != te.selectionEnd; }
	    catch(e) { return false; }
	  } : function(te) {
	    try {var range = te.ownerDocument.selection.createRange();}
	    catch(e) {}
	    if (!range || range.parentElement() != te) return false;
	    return range.compareEndPoints("StartToEnd", range) != 0;
	  };

	  var hasCopyEvent = (function() {
	    var e = elt("div");
	    if ("oncopy" in e) return true;
	    e.setAttribute("oncopy", "return;");
	    return typeof e.oncopy == "function";
	  })();

	  var badZoomedRects = null;
	  function hasBadZoomedRects(measure) {
	    if (badZoomedRects != null) return badZoomedRects;
	    var node = removeChildrenAndAdd(measure, elt("span", "x"));
	    var normal = node.getBoundingClientRect();
	    var fromRange = range(node, 0, 1).getBoundingClientRect();
	    return badZoomedRects = Math.abs(normal.left - fromRange.left) > 1;
	  }

	  // KEY NAMES

	  var keyNames = CodeMirror.keyNames = {
	    3: "Enter", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt",
	    19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End",
	    36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert",
	    46: "Delete", 59: ";", 61: "=", 91: "Mod", 92: "Mod", 93: "Mod",
	    106: "*", 107: "=", 109: "-", 110: ".", 111: "/", 127: "Delete",
	    173: "-", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\",
	    221: "]", 222: "'", 63232: "Up", 63233: "Down", 63234: "Left", 63235: "Right", 63272: "Delete",
	    63273: "Home", 63275: "End", 63276: "PageUp", 63277: "PageDown", 63302: "Insert"
	  };
	  (function() {
	    // Number keys
	    for (var i = 0; i < 10; i++) keyNames[i + 48] = keyNames[i + 96] = String(i);
	    // Alphabetic keys
	    for (var i = 65; i <= 90; i++) keyNames[i] = String.fromCharCode(i);
	    // Function keys
	    for (var i = 1; i <= 12; i++) keyNames[i + 111] = keyNames[i + 63235] = "F" + i;
	  })();

	  // BIDI HELPERS

	  function iterateBidiSections(order, from, to, f) {
	    if (!order) return f(from, to, "ltr");
	    var found = false;
	    for (var i = 0; i < order.length; ++i) {
	      var part = order[i];
	      if (part.from < to && part.to > from || from == to && part.to == from) {
	        f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? "rtl" : "ltr");
	        found = true;
	      }
	    }
	    if (!found) f(from, to, "ltr");
	  }

	  function bidiLeft(part) { return part.level % 2 ? part.to : part.from; }
	  function bidiRight(part) { return part.level % 2 ? part.from : part.to; }

	  function lineLeft(line) { var order = getOrder(line); return order ? bidiLeft(order[0]) : 0; }
	  function lineRight(line) {
	    var order = getOrder(line);
	    if (!order) return line.text.length;
	    return bidiRight(lst(order));
	  }

	  function lineStart(cm, lineN) {
	    var line = getLine(cm.doc, lineN);
	    var visual = visualLine(line);
	    if (visual != line) lineN = lineNo(visual);
	    var order = getOrder(visual);
	    var ch = !order ? 0 : order[0].level % 2 ? lineRight(visual) : lineLeft(visual);
	    return Pos(lineN, ch);
	  }
	  function lineEnd(cm, lineN) {
	    var merged, line = getLine(cm.doc, lineN);
	    while (merged = collapsedSpanAtEnd(line)) {
	      line = merged.find(1, true).line;
	      lineN = null;
	    }
	    var order = getOrder(line);
	    var ch = !order ? line.text.length : order[0].level % 2 ? lineLeft(line) : lineRight(line);
	    return Pos(lineN == null ? lineNo(line) : lineN, ch);
	  }
	  function lineStartSmart(cm, pos) {
	    var start = lineStart(cm, pos.line);
	    var line = getLine(cm.doc, start.line);
	    var order = getOrder(line);
	    if (!order || order[0].level == 0) {
	      var firstNonWS = Math.max(0, line.text.search(/\S/));
	      var inWS = pos.line == start.line && pos.ch <= firstNonWS && pos.ch;
	      return Pos(start.line, inWS ? 0 : firstNonWS);
	    }
	    return start;
	  }

	  function compareBidiLevel(order, a, b) {
	    var linedir = order[0].level;
	    if (a == linedir) return true;
	    if (b == linedir) return false;
	    return a < b;
	  }
	  var bidiOther;
	  function getBidiPartAt(order, pos) {
	    bidiOther = null;
	    for (var i = 0, found; i < order.length; ++i) {
	      var cur = order[i];
	      if (cur.from < pos && cur.to > pos) return i;
	      if ((cur.from == pos || cur.to == pos)) {
	        if (found == null) {
	          found = i;
	        } else if (compareBidiLevel(order, cur.level, order[found].level)) {
	          if (cur.from != cur.to) bidiOther = found;
	          return i;
	        } else {
	          if (cur.from != cur.to) bidiOther = i;
	          return found;
	        }
	      }
	    }
	    return found;
	  }

	  function moveInLine(line, pos, dir, byUnit) {
	    if (!byUnit) return pos + dir;
	    do pos += dir;
	    while (pos > 0 && isExtendingChar(line.text.charAt(pos)));
	    return pos;
	  }

	  // This is needed in order to move 'visually' through bi-directional
	  // text -- i.e., pressing left should make the cursor go left, even
	  // when in RTL text. The tricky part is the 'jumps', where RTL and
	  // LTR text touch each other. This often requires the cursor offset
	  // to move more than one unit, in order to visually move one unit.
	  function moveVisually(line, start, dir, byUnit) {
	    var bidi = getOrder(line);
	    if (!bidi) return moveLogically(line, start, dir, byUnit);
	    var pos = getBidiPartAt(bidi, start), part = bidi[pos];
	    var target = moveInLine(line, start, part.level % 2 ? -dir : dir, byUnit);

	    for (;;) {
	      if (target > part.from && target < part.to) return target;
	      if (target == part.from || target == part.to) {
	        if (getBidiPartAt(bidi, target) == pos) return target;
	        part = bidi[pos += dir];
	        return (dir > 0) == part.level % 2 ? part.to : part.from;
	      } else {
	        part = bidi[pos += dir];
	        if (!part) return null;
	        if ((dir > 0) == part.level % 2)
	          target = moveInLine(line, part.to, -1, byUnit);
	        else
	          target = moveInLine(line, part.from, 1, byUnit);
	      }
	    }
	  }

	  function moveLogically(line, start, dir, byUnit) {
	    var target = start + dir;
	    if (byUnit) while (target > 0 && isExtendingChar(line.text.charAt(target))) target += dir;
	    return target < 0 || target > line.text.length ? null : target;
	  }

	  // Bidirectional ordering algorithm
	  // See http://unicode.org/reports/tr9/tr9-13.html for the algorithm
	  // that this (partially) implements.

	  // One-char codes used for character types:
	  // L (L):   Left-to-Right
	  // R (R):   Right-to-Left
	  // r (AL):  Right-to-Left Arabic
	  // 1 (EN):  European Number
	  // + (ES):  European Number Separator
	  // % (ET):  European Number Terminator
	  // n (AN):  Arabic Number
	  // , (CS):  Common Number Separator
	  // m (NSM): Non-Spacing Mark
	  // b (BN):  Boundary Neutral
	  // s (B):   Paragraph Separator
	  // t (S):   Segment Separator
	  // w (WS):  Whitespace
	  // N (ON):  Other Neutrals

	  // Returns null if characters are ordered as they appear
	  // (left-to-right), or an array of sections ({from, to, level}
	  // objects) in the order in which they occur visually.
	  var bidiOrdering = (function() {
	    // Character types for codepoints 0 to 0xff
	    var lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";
	    // Character types for codepoints 0x600 to 0x6ff
	    var arabicTypes = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm";
	    function charType(code) {
	      if (code <= 0xf7) return lowTypes.charAt(code);
	      else if (0x590 <= code && code <= 0x5f4) return "R";
	      else if (0x600 <= code && code <= 0x6ed) return arabicTypes.charAt(code - 0x600);
	      else if (0x6ee <= code && code <= 0x8ac) return "r";
	      else if (0x2000 <= code && code <= 0x200b) return "w";
	      else if (code == 0x200c) return "b";
	      else return "L";
	    }

	    var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
	    var isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
	    // Browsers seem to always treat the boundaries of block elements as being L.
	    var outerType = "L";

	    function BidiSpan(level, from, to) {
	      this.level = level;
	      this.from = from; this.to = to;
	    }

	    return function(str) {
	      if (!bidiRE.test(str)) return false;
	      var len = str.length, types = [];
	      for (var i = 0, type; i < len; ++i)
	        types.push(type = charType(str.charCodeAt(i)));

	      // W1. Examine each non-spacing mark (NSM) in the level run, and
	      // change the type of the NSM to the type of the previous
	      // character. If the NSM is at the start of the level run, it will
	      // get the type of sor.
	      for (var i = 0, prev = outerType; i < len; ++i) {
	        var type = types[i];
	        if (type == "m") types[i] = prev;
	        else prev = type;
	      }

	      // W2. Search backwards from each instance of a European number
	      // until the first strong type (R, L, AL, or sor) is found. If an
	      // AL is found, change the type of the European number to Arabic
	      // number.
	      // W3. Change all ALs to R.
	      for (var i = 0, cur = outerType; i < len; ++i) {
	        var type = types[i];
	        if (type == "1" && cur == "r") types[i] = "n";
	        else if (isStrong.test(type)) { cur = type; if (type == "r") types[i] = "R"; }
	      }

	      // W4. A single European separator between two European numbers
	      // changes to a European number. A single common separator between
	      // two numbers of the same type changes to that type.
	      for (var i = 1, prev = types[0]; i < len - 1; ++i) {
	        var type = types[i];
	        if (type == "+" && prev == "1" && types[i+1] == "1") types[i] = "1";
	        else if (type == "," && prev == types[i+1] &&
	                 (prev == "1" || prev == "n")) types[i] = prev;
	        prev = type;
	      }

	      // W5. A sequence of European terminators adjacent to European
	      // numbers changes to all European numbers.
	      // W6. Otherwise, separators and terminators change to Other
	      // Neutral.
	      for (var i = 0; i < len; ++i) {
	        var type = types[i];
	        if (type == ",") types[i] = "N";
	        else if (type == "%") {
	          for (var end = i + 1; end < len && types[end] == "%"; ++end) {}
	          var replace = (i && types[i-1] == "!") || (end < len && types[end] == "1") ? "1" : "N";
	          for (var j = i; j < end; ++j) types[j] = replace;
	          i = end - 1;
	        }
	      }

	      // W7. Search backwards from each instance of a European number
	      // until the first strong type (R, L, or sor) is found. If an L is
	      // found, then change the type of the European number to L.
	      for (var i = 0, cur = outerType; i < len; ++i) {
	        var type = types[i];
	        if (cur == "L" && type == "1") types[i] = "L";
	        else if (isStrong.test(type)) cur = type;
	      }

	      // N1. A sequence of neutrals takes the direction of the
	      // surrounding strong text if the text on both sides has the same
	      // direction. European and Arabic numbers act as if they were R in
	      // terms of their influence on neutrals. Start-of-level-run (sor)
	      // and end-of-level-run (eor) are used at level run boundaries.
	      // N2. Any remaining neutrals take the embedding direction.
	      for (var i = 0; i < len; ++i) {
	        if (isNeutral.test(types[i])) {
	          for (var end = i + 1; end < len && isNeutral.test(types[end]); ++end) {}
	          var before = (i ? types[i-1] : outerType) == "L";
	          var after = (end < len ? types[end] : outerType) == "L";
	          var replace = before || after ? "L" : "R";
	          for (var j = i; j < end; ++j) types[j] = replace;
	          i = end - 1;
	        }
	      }

	      // Here we depart from the documented algorithm, in order to avoid
	      // building up an actual levels array. Since there are only three
	      // levels (0, 1, 2) in an implementation that doesn't take
	      // explicit embedding into account, we can build up the order on
	      // the fly, without following the level-based algorithm.
	      var order = [], m;
	      for (var i = 0; i < len;) {
	        if (countsAsLeft.test(types[i])) {
	          var start = i;
	          for (++i; i < len && countsAsLeft.test(types[i]); ++i) {}
	          order.push(new BidiSpan(0, start, i));
	        } else {
	          var pos = i, at = order.length;
	          for (++i; i < len && types[i] != "L"; ++i) {}
	          for (var j = pos; j < i;) {
	            if (countsAsNum.test(types[j])) {
	              if (pos < j) order.splice(at, 0, new BidiSpan(1, pos, j));
	              var nstart = j;
	              for (++j; j < i && countsAsNum.test(types[j]); ++j) {}
	              order.splice(at, 0, new BidiSpan(2, nstart, j));
	              pos = j;
	            } else ++j;
	          }
	          if (pos < i) order.splice(at, 0, new BidiSpan(1, pos, i));
	        }
	      }
	      if (order[0].level == 1 && (m = str.match(/^\s+/))) {
	        order[0].from = m[0].length;
	        order.unshift(new BidiSpan(0, 0, m[0].length));
	      }
	      if (lst(order).level == 1 && (m = str.match(/\s+$/))) {
	        lst(order).to -= m[0].length;
	        order.push(new BidiSpan(0, len - m[0].length, len));
	      }
	      if (order[0].level == 2)
	        order.unshift(new BidiSpan(1, order[0].to, order[0].to));
	      if (order[0].level != lst(order).level)
	        order.push(new BidiSpan(order[0].level, len, len));

	      return order;
	    };
	  })();

	  // THE END

	  CodeMirror.version = "5.18.2";

	  return CodeMirror;
	});


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(74);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(12)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./codemirror.css", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./codemirror.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(11)();
	// imports


	// module
	exports.push([module.id, "/* BASICS */\n\n.CodeMirror {\n  /* Set height, width, borders, and global font properties here */\n  font-family: monospace;\n  height: 300px;\n  color: black;\n}\n\n/* PADDING */\n\n.CodeMirror-lines {\n  padding: 4px 0; /* Vertical padding around content */\n}\n.CodeMirror pre {\n  padding: 0 4px; /* Horizontal padding of content */\n}\n\n.CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n  background-color: white; /* The little square between H and V scrollbars */\n}\n\n/* GUTTER */\n\n.CodeMirror-gutters {\n  border-right: 1px solid #ddd;\n  background-color: #f7f7f7;\n  white-space: nowrap;\n}\n.CodeMirror-linenumbers {}\n.CodeMirror-linenumber {\n  padding: 0 3px 0 5px;\n  min-width: 20px;\n  text-align: right;\n  color: #999;\n  white-space: nowrap;\n}\n\n.CodeMirror-guttermarker { color: black; }\n.CodeMirror-guttermarker-subtle { color: #999; }\n\n/* CURSOR */\n\n.CodeMirror-cursor {\n  border-left: 1px solid black;\n  border-right: none;\n  width: 0;\n}\n/* Shown when moving in bi-directional text */\n.CodeMirror div.CodeMirror-secondarycursor {\n  border-left: 1px solid silver;\n}\n.cm-fat-cursor .CodeMirror-cursor {\n  width: auto;\n  border: 0 !important;\n  background: #7e7;\n}\n.cm-fat-cursor div.CodeMirror-cursors {\n  z-index: 1;\n}\n\n.cm-animate-fat-cursor {\n  width: auto;\n  border: 0;\n  -webkit-animation: blink 1.06s steps(1) infinite;\n  -moz-animation: blink 1.06s steps(1) infinite;\n  animation: blink 1.06s steps(1) infinite;\n  background-color: #7e7;\n}\n@-moz-keyframes blink {\n  0% {}\n  50% { background-color: transparent; }\n  100% {}\n}\n@-webkit-keyframes blink {\n  0% {}\n  50% { background-color: transparent; }\n  100% {}\n}\n@keyframes blink {\n  0% {}\n  50% { background-color: transparent; }\n  100% {}\n}\n\n/* Can style cursor different in overwrite (non-insert) mode */\n.CodeMirror-overwrite .CodeMirror-cursor {}\n\n.cm-tab { display: inline-block; text-decoration: inherit; }\n\n.CodeMirror-rulers {\n  position: absolute;\n  left: 0; right: 0; top: -50px; bottom: -20px;\n  overflow: hidden;\n}\n.CodeMirror-ruler {\n  border-left: 1px solid #ccc;\n  top: 0; bottom: 0;\n  position: absolute;\n}\n\n/* DEFAULT THEME */\n\n.cm-s-default .cm-header {color: blue;}\n.cm-s-default .cm-quote {color: #090;}\n.cm-negative {color: #d44;}\n.cm-positive {color: #292;}\n.cm-header, .cm-strong {font-weight: bold;}\n.cm-em {font-style: italic;}\n.cm-link {text-decoration: underline;}\n.cm-strikethrough {text-decoration: line-through;}\n\n.cm-s-default .cm-keyword {color: #708;}\n.cm-s-default .cm-atom {color: #219;}\n.cm-s-default .cm-number {color: #164;}\n.cm-s-default .cm-def {color: #00f;}\n.cm-s-default .cm-variable,\n.cm-s-default .cm-punctuation,\n.cm-s-default .cm-property,\n.cm-s-default .cm-operator {}\n.cm-s-default .cm-variable-2 {color: #05a;}\n.cm-s-default .cm-variable-3 {color: #085;}\n.cm-s-default .cm-comment {color: #a50;}\n.cm-s-default .cm-string {color: #a11;}\n.cm-s-default .cm-string-2 {color: #f50;}\n.cm-s-default .cm-meta {color: #555;}\n.cm-s-default .cm-qualifier {color: #555;}\n.cm-s-default .cm-builtin {color: #30a;}\n.cm-s-default .cm-bracket {color: #997;}\n.cm-s-default .cm-tag {color: #170;}\n.cm-s-default .cm-attribute {color: #00c;}\n.cm-s-default .cm-hr {color: #999;}\n.cm-s-default .cm-link {color: #00c;}\n\n.cm-s-default .cm-error {color: #f00;}\n.cm-invalidchar {color: #f00;}\n\n.CodeMirror-composing { border-bottom: 2px solid; }\n\n/* Default styles for common addons */\n\ndiv.CodeMirror span.CodeMirror-matchingbracket {color: #0f0;}\ndiv.CodeMirror span.CodeMirror-nonmatchingbracket {color: #f22;}\n.CodeMirror-matchingtag { background: rgba(255, 150, 0, .3); }\n.CodeMirror-activeline-background {background: #e8f2ff;}\n\n/* STOP */\n\n/* The rest of this file contains styles related to the mechanics of\n   the editor. You probably shouldn't touch them. */\n\n.CodeMirror {\n  position: relative;\n  overflow: hidden;\n  background: white;\n}\n\n.CodeMirror-scroll {\n  overflow: scroll !important; /* Things will break if this is overridden */\n  /* 30px is the magic margin used to hide the element's real scrollbars */\n  /* See overflow: hidden in .CodeMirror */\n  margin-bottom: -30px; margin-right: -30px;\n  padding-bottom: 30px;\n  height: 100%;\n  outline: none; /* Prevent dragging from highlighting the element */\n  position: relative;\n}\n.CodeMirror-sizer {\n  position: relative;\n  border-right: 30px solid transparent;\n}\n\n/* The fake, visible scrollbars. Used to force redraw during scrolling\n   before actual scrolling happens, thus preventing shaking and\n   flickering artifacts. */\n.CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n  position: absolute;\n  z-index: 6;\n  display: none;\n}\n.CodeMirror-vscrollbar {\n  right: 0; top: 0;\n  overflow-x: hidden;\n  overflow-y: scroll;\n}\n.CodeMirror-hscrollbar {\n  bottom: 0; left: 0;\n  overflow-y: hidden;\n  overflow-x: scroll;\n}\n.CodeMirror-scrollbar-filler {\n  right: 0; bottom: 0;\n}\n.CodeMirror-gutter-filler {\n  left: 0; bottom: 0;\n}\n\n.CodeMirror-gutters {\n  position: absolute; left: 0; top: 0;\n  min-height: 100%;\n  z-index: 3;\n}\n.CodeMirror-gutter {\n  white-space: normal;\n  height: 100%;\n  display: inline-block;\n  vertical-align: top;\n  margin-bottom: -30px;\n  /* Hack to make IE7 behave */\n  *zoom:1;\n  *display:inline;\n}\n.CodeMirror-gutter-wrapper {\n  position: absolute;\n  z-index: 4;\n  background: none !important;\n  border: none !important;\n}\n.CodeMirror-gutter-background {\n  position: absolute;\n  top: 0; bottom: 0;\n  z-index: 4;\n}\n.CodeMirror-gutter-elt {\n  position: absolute;\n  cursor: default;\n  z-index: 4;\n}\n.CodeMirror-gutter-wrapper {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none;\n}\n\n.CodeMirror-lines {\n  cursor: text;\n  min-height: 1px; /* prevents collapsing before first draw */\n}\n.CodeMirror pre {\n  /* Reset some styles that the rest of the page might have set */\n  -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0;\n  border-width: 0;\n  background: transparent;\n  font-family: inherit;\n  font-size: inherit;\n  margin: 0;\n  white-space: pre;\n  word-wrap: normal;\n  line-height: inherit;\n  color: inherit;\n  z-index: 2;\n  position: relative;\n  overflow: visible;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-font-variant-ligatures: none;\n  font-variant-ligatures: none;\n}\n.CodeMirror-wrap pre {\n  word-wrap: break-word;\n  white-space: pre-wrap;\n  word-break: normal;\n}\n\n.CodeMirror-linebackground {\n  position: absolute;\n  left: 0; right: 0; top: 0; bottom: 0;\n  z-index: 0;\n}\n\n.CodeMirror-linewidget {\n  position: relative;\n  z-index: 2;\n  overflow: auto;\n}\n\n.CodeMirror-widget {}\n\n.CodeMirror-code {\n  outline: none;\n}\n\n/* Force content-box sizing for the elements where we expect it */\n.CodeMirror-scroll,\n.CodeMirror-sizer,\n.CodeMirror-gutter,\n.CodeMirror-gutters,\n.CodeMirror-linenumber {\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n\n.CodeMirror-measure {\n  position: absolute;\n  width: 100%;\n  height: 0;\n  overflow: hidden;\n  visibility: hidden;\n}\n\n.CodeMirror-cursor {\n  position: absolute;\n  pointer-events: none;\n}\n.CodeMirror-measure pre { position: static; }\n\ndiv.CodeMirror-cursors {\n  visibility: hidden;\n  position: relative;\n  z-index: 3;\n}\ndiv.CodeMirror-dragcursors {\n  visibility: visible;\n}\n\n.CodeMirror-focused div.CodeMirror-cursors {\n  visibility: visible;\n}\n\n.CodeMirror-selected { background: #d9d9d9; }\n.CodeMirror-focused .CodeMirror-selected { background: #d7d4f0; }\n.CodeMirror-crosshair { cursor: crosshair; }\n.CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { background: #d7d4f0; }\n.CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { background: #d7d4f0; }\n\n.cm-searching {\n  background: #ffa;\n  background: rgba(255, 255, 0, .4);\n}\n\n/* IE7 hack to prevent it from returning funny offsetTops on the spans */\n.CodeMirror span { *vertical-align: text-bottom; }\n\n/* Used to force a border model for a node */\n.cm-force-border { padding-right: .1px; }\n\n@media print {\n  /* Hide the cursor when printing */\n  .CodeMirror div.CodeMirror-cursors {\n    visibility: hidden;\n  }\n}\n\n/* See issue #2901 */\n.cm-tab-wrap-hack:after { content: ''; }\n\n/* Help users use markselection to safely style text background */\nspan.CodeMirror-selectedtext { background: none; }\n", ""]);

	// exports


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE

	(function(mod) {
	  if (true) // CommonJS
	    mod(__webpack_require__(72));
	  else if (typeof define == "function" && define.amd) // AMD
	    define(["../../lib/codemirror"], mod);
	  else // Plain browser env
	    mod(CodeMirror);
	})(function(CodeMirror) {
	"use strict";

	function expressionAllowed(stream, state, backUp) {
	  return /^(?:operator|sof|keyword c|case|new|[\[{}\(,;:]|=>)$/.test(state.lastType) ||
	    (state.lastType == "quasi" && /\{\s*$/.test(stream.string.slice(0, stream.pos - (backUp || 0))))
	}

	CodeMirror.defineMode("javascript", function(config, parserConfig) {
	  var indentUnit = config.indentUnit;
	  var statementIndent = parserConfig.statementIndent;
	  var jsonldMode = parserConfig.jsonld;
	  var jsonMode = parserConfig.json || jsonldMode;
	  var isTS = parserConfig.typescript;
	  var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;

	  // Tokenizer

	  var keywords = function(){
	    function kw(type) {return {type: type, style: "keyword"};}
	    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
	    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

	    var jsKeywords = {
	      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
	      "return": C, "break": C, "continue": C, "new": kw("new"), "delete": C, "throw": C, "debugger": C,
	      "var": kw("var"), "const": kw("var"), "let": kw("var"),
	      "function": kw("function"), "catch": kw("catch"),
	      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
	      "in": operator, "typeof": operator, "instanceof": operator,
	      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
	      "this": kw("this"), "class": kw("class"), "super": kw("atom"),
	      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C,
	      "await": C, "async": kw("async")
	    };

	    // Extend the 'normal' keywords with the TypeScript language extensions
	    if (isTS) {
	      var type = {type: "variable", style: "variable-3"};
	      var tsKeywords = {
	        // object-like things
	        "interface": kw("class"),
	        "implements": C,
	        "namespace": C,
	        "module": kw("module"),
	        "enum": kw("module"),

	        // scope modifiers
	        "public": kw("modifier"),
	        "private": kw("modifier"),
	        "protected": kw("modifier"),
	        "abstract": kw("modifier"),

	        // operators
	        "as": operator,

	        // types
	        "string": type, "number": type, "boolean": type, "any": type
	      };

	      for (var attr in tsKeywords) {
	        jsKeywords[attr] = tsKeywords[attr];
	      }
	    }

	    return jsKeywords;
	  }();

	  var isOperatorChar = /[+\-*&%=<>!?|~^]/;
	  var isJsonldKeyword = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;

	  function readRegexp(stream) {
	    var escaped = false, next, inSet = false;
	    while ((next = stream.next()) != null) {
	      if (!escaped) {
	        if (next == "/" && !inSet) return;
	        if (next == "[") inSet = true;
	        else if (inSet && next == "]") inSet = false;
	      }
	      escaped = !escaped && next == "\\";
	    }
	  }

	  // Used as scratch variables to communicate multiple values without
	  // consing up tons of objects.
	  var type, content;
	  function ret(tp, style, cont) {
	    type = tp; content = cont;
	    return style;
	  }
	  function tokenBase(stream, state) {
	    var ch = stream.next();
	    if (ch == '"' || ch == "'") {
	      state.tokenize = tokenString(ch);
	      return state.tokenize(stream, state);
	    } else if (ch == "." && stream.match(/^\d+(?:[eE][+\-]?\d+)?/)) {
	      return ret("number", "number");
	    } else if (ch == "." && stream.match("..")) {
	      return ret("spread", "meta");
	    } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
	      return ret(ch);
	    } else if (ch == "=" && stream.eat(">")) {
	      return ret("=>", "operator");
	    } else if (ch == "0" && stream.eat(/x/i)) {
	      stream.eatWhile(/[\da-f]/i);
	      return ret("number", "number");
	    } else if (ch == "0" && stream.eat(/o/i)) {
	      stream.eatWhile(/[0-7]/i);
	      return ret("number", "number");
	    } else if (ch == "0" && stream.eat(/b/i)) {
	      stream.eatWhile(/[01]/i);
	      return ret("number", "number");
	    } else if (/\d/.test(ch)) {
	      stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
	      return ret("number", "number");
	    } else if (ch == "/") {
	      if (stream.eat("*")) {
	        state.tokenize = tokenComment;
	        return tokenComment(stream, state);
	      } else if (stream.eat("/")) {
	        stream.skipToEnd();
	        return ret("comment", "comment");
	      } else if (expressionAllowed(stream, state, 1)) {
	        readRegexp(stream);
	        stream.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/);
	        return ret("regexp", "string-2");
	      } else {
	        stream.eatWhile(isOperatorChar);
	        return ret("operator", "operator", stream.current());
	      }
	    } else if (ch == "`") {
	      state.tokenize = tokenQuasi;
	      return tokenQuasi(stream, state);
	    } else if (ch == "#") {
	      stream.skipToEnd();
	      return ret("error", "error");
	    } else if (isOperatorChar.test(ch)) {
	      stream.eatWhile(isOperatorChar);
	      return ret("operator", "operator", stream.current());
	    } else if (wordRE.test(ch)) {
	      stream.eatWhile(wordRE);
	      var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];
	      return (known && state.lastType != ".") ? ret(known.type, known.style, word) :
	                     ret("variable", "variable", word);
	    }
	  }

	  function tokenString(quote) {
	    return function(stream, state) {
	      var escaped = false, next;
	      if (jsonldMode && stream.peek() == "@" && stream.match(isJsonldKeyword)){
	        state.tokenize = tokenBase;
	        return ret("jsonld-keyword", "meta");
	      }
	      while ((next = stream.next()) != null) {
	        if (next == quote && !escaped) break;
	        escaped = !escaped && next == "\\";
	      }
	      if (!escaped) state.tokenize = tokenBase;
	      return ret("string", "string");
	    };
	  }

	  function tokenComment(stream, state) {
	    var maybeEnd = false, ch;
	    while (ch = stream.next()) {
	      if (ch == "/" && maybeEnd) {
	        state.tokenize = tokenBase;
	        break;
	      }
	      maybeEnd = (ch == "*");
	    }
	    return ret("comment", "comment");
	  }

	  function tokenQuasi(stream, state) {
	    var escaped = false, next;
	    while ((next = stream.next()) != null) {
	      if (!escaped && (next == "`" || next == "$" && stream.eat("{"))) {
	        state.tokenize = tokenBase;
	        break;
	      }
	      escaped = !escaped && next == "\\";
	    }
	    return ret("quasi", "string-2", stream.current());
	  }

	  var brackets = "([{}])";
	  // This is a crude lookahead trick to try and notice that we're
	  // parsing the argument patterns for a fat-arrow function before we
	  // actually hit the arrow token. It only works if the arrow is on
	  // the same line as the arguments and there's no strange noise
	  // (comments) in between. Fallback is to only notice when we hit the
	  // arrow, and not declare the arguments as locals for the arrow
	  // body.
	  function findFatArrow(stream, state) {
	    if (state.fatArrowAt) state.fatArrowAt = null;
	    var arrow = stream.string.indexOf("=>", stream.start);
	    if (arrow < 0) return;

	    var depth = 0, sawSomething = false;
	    for (var pos = arrow - 1; pos >= 0; --pos) {
	      var ch = stream.string.charAt(pos);
	      var bracket = brackets.indexOf(ch);
	      if (bracket >= 0 && bracket < 3) {
	        if (!depth) { ++pos; break; }
	        if (--depth == 0) { if (ch == "(") sawSomething = true; break; }
	      } else if (bracket >= 3 && bracket < 6) {
	        ++depth;
	      } else if (wordRE.test(ch)) {
	        sawSomething = true;
	      } else if (/["'\/]/.test(ch)) {
	        return;
	      } else if (sawSomething && !depth) {
	        ++pos;
	        break;
	      }
	    }
	    if (sawSomething && !depth) state.fatArrowAt = pos;
	  }

	  // Parser

	  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true, "jsonld-keyword": true};

	  function JSLexical(indented, column, type, align, prev, info) {
	    this.indented = indented;
	    this.column = column;
	    this.type = type;
	    this.prev = prev;
	    this.info = info;
	    if (align != null) this.align = align;
	  }

	  function inScope(state, varname) {
	    for (var v = state.localVars; v; v = v.next)
	      if (v.name == varname) return true;
	    for (var cx = state.context; cx; cx = cx.prev) {
	      for (var v = cx.vars; v; v = v.next)
	        if (v.name == varname) return true;
	    }
	  }

	  function parseJS(state, style, type, content, stream) {
	    var cc = state.cc;
	    // Communicate our context to the combinators.
	    // (Less wasteful than consing up a hundred closures on every call.)
	    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc; cx.style = style;

	    if (!state.lexical.hasOwnProperty("align"))
	      state.lexical.align = true;

	    while(true) {
	      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
	      if (combinator(type, content)) {
	        while(cc.length && cc[cc.length - 1].lex)
	          cc.pop()();
	        if (cx.marked) return cx.marked;
	        if (type == "variable" && inScope(state, content)) return "variable-2";
	        return style;
	      }
	    }
	  }

	  // Combinator utils

	  var cx = {state: null, column: null, marked: null, cc: null};
	  function pass() {
	    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
	  }
	  function cont() {
	    pass.apply(null, arguments);
	    return true;
	  }
	  function register(varname) {
	    function inList(list) {
	      for (var v = list; v; v = v.next)
	        if (v.name == varname) return true;
	      return false;
	    }
	    var state = cx.state;
	    cx.marked = "def";
	    if (state.context) {
	      if (inList(state.localVars)) return;
	      state.localVars = {name: varname, next: state.localVars};
	    } else {
	      if (inList(state.globalVars)) return;
	      if (parserConfig.globalVars)
	        state.globalVars = {name: varname, next: state.globalVars};
	    }
	  }

	  // Combinators

	  var defaultVars = {name: "this", next: {name: "arguments"}};
	  function pushcontext() {
	    cx.state.context = {prev: cx.state.context, vars: cx.state.localVars};
	    cx.state.localVars = defaultVars;
	  }
	  function popcontext() {
	    cx.state.localVars = cx.state.context.vars;
	    cx.state.context = cx.state.context.prev;
	  }
	  function pushlex(type, info) {
	    var result = function() {
	      var state = cx.state, indent = state.indented;
	      if (state.lexical.type == "stat") indent = state.lexical.indented;
	      else for (var outer = state.lexical; outer && outer.type == ")" && outer.align; outer = outer.prev)
	        indent = outer.indented;
	      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
	    };
	    result.lex = true;
	    return result;
	  }
	  function poplex() {
	    var state = cx.state;
	    if (state.lexical.prev) {
	      if (state.lexical.type == ")")
	        state.indented = state.lexical.indented;
	      state.lexical = state.lexical.prev;
	    }
	  }
	  poplex.lex = true;

	  function expect(wanted) {
	    function exp(type) {
	      if (type == wanted) return cont();
	      else if (wanted == ";") return pass();
	      else return cont(exp);
	    };
	    return exp;
	  }

	  function statement(type, value) {
	    if (type == "var") return cont(pushlex("vardef", value.length), vardef, expect(";"), poplex);
	    if (type == "keyword a") return cont(pushlex("form"), expression, statement, poplex);
	    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
	    if (type == "{") return cont(pushlex("}"), block, poplex);
	    if (type == ";") return cont();
	    if (type == "if") {
	      if (cx.state.lexical.info == "else" && cx.state.cc[cx.state.cc.length - 1] == poplex)
	        cx.state.cc.pop()();
	      return cont(pushlex("form"), expression, statement, poplex, maybeelse);
	    }
	    if (type == "function") return cont(functiondef);
	    if (type == "for") return cont(pushlex("form"), forspec, statement, poplex);
	    if (type == "variable") return cont(pushlex("stat"), maybelabel);
	    if (type == "switch") return cont(pushlex("form"), expression, pushlex("}", "switch"), expect("{"),
	                                      block, poplex, poplex);
	    if (type == "case") return cont(expression, expect(":"));
	    if (type == "default") return cont(expect(":"));
	    if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"),
	                                     statement, poplex, popcontext);
	    if (type == "class") return cont(pushlex("form"), className, poplex);
	    if (type == "export") return cont(pushlex("stat"), afterExport, poplex);
	    if (type == "import") return cont(pushlex("stat"), afterImport, poplex);
	    if (type == "module") return cont(pushlex("form"), pattern, pushlex("}"), expect("{"), block, poplex, poplex)
	    if (type == "async") return cont(statement)
	    return pass(pushlex("stat"), expression, expect(";"), poplex);
	  }
	  function expression(type) {
	    return expressionInner(type, false);
	  }
	  function expressionNoComma(type) {
	    return expressionInner(type, true);
	  }
	  function expressionInner(type, noComma) {
	    if (cx.state.fatArrowAt == cx.stream.start) {
	      var body = noComma ? arrowBodyNoComma : arrowBody;
	      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(pattern, ")"), poplex, expect("=>"), body, popcontext);
	      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
	    }

	    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
	    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
	    if (type == "function") return cont(functiondef, maybeop);
	    if (type == "keyword c" || type == "async") return cont(noComma ? maybeexpressionNoComma : maybeexpression);
	    if (type == "(") return cont(pushlex(")"), maybeexpression, expect(")"), poplex, maybeop);
	    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
	    if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
	    if (type == "{") return contCommasep(objprop, "}", null, maybeop);
	    if (type == "quasi") return pass(quasi, maybeop);
	    if (type == "new") return cont(maybeTarget(noComma));
	    return cont();
	  }
	  function maybeexpression(type) {
	    if (type.match(/[;\}\)\],]/)) return pass();
	    return pass(expression);
	  }
	  function maybeexpressionNoComma(type) {
	    if (type.match(/[;\}\)\],]/)) return pass();
	    return pass(expressionNoComma);
	  }

	  function maybeoperatorComma(type, value) {
	    if (type == ",") return cont(expression);
	    return maybeoperatorNoComma(type, value, false);
	  }
	  function maybeoperatorNoComma(type, value, noComma) {
	    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
	    var expr = noComma == false ? expression : expressionNoComma;
	    if (type == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
	    if (type == "operator") {
	      if (/\+\+|--/.test(value)) return cont(me);
	      if (value == "?") return cont(expression, expect(":"), expr);
	      return cont(expr);
	    }
	    if (type == "quasi") { return pass(quasi, me); }
	    if (type == ";") return;
	    if (type == "(") return contCommasep(expressionNoComma, ")", "call", me);
	    if (type == ".") return cont(property, me);
	    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
	  }
	  function quasi(type, value) {
	    if (type != "quasi") return pass();
	    if (value.slice(value.length - 2) != "${") return cont(quasi);
	    return cont(expression, continueQuasi);
	  }
	  function continueQuasi(type) {
	    if (type == "}") {
	      cx.marked = "string-2";
	      cx.state.tokenize = tokenQuasi;
	      return cont(quasi);
	    }
	  }
	  function arrowBody(type) {
	    findFatArrow(cx.stream, cx.state);
	    return pass(type == "{" ? statement : expression);
	  }
	  function arrowBodyNoComma(type) {
	    findFatArrow(cx.stream, cx.state);
	    return pass(type == "{" ? statement : expressionNoComma);
	  }
	  function maybeTarget(noComma) {
	    return function(type) {
	      if (type == ".") return cont(noComma ? targetNoComma : target);
	      else return pass(noComma ? expressionNoComma : expression);
	    };
	  }
	  function target(_, value) {
	    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorComma); }
	  }
	  function targetNoComma(_, value) {
	    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorNoComma); }
	  }
	  function maybelabel(type) {
	    if (type == ":") return cont(poplex, statement);
	    return pass(maybeoperatorComma, expect(";"), poplex);
	  }
	  function property(type) {
	    if (type == "variable") {cx.marked = "property"; return cont();}
	  }
	  function objprop(type, value) {
	    if (type == "async") {
	      cx.marked = "property";
	      return cont(objprop);
	    } else if (type == "variable" || cx.style == "keyword") {
	      cx.marked = "property";
	      if (value == "get" || value == "set") return cont(getterSetter);
	      return cont(afterprop);
	    } else if (type == "number" || type == "string") {
	      cx.marked = jsonldMode ? "property" : (cx.style + " property");
	      return cont(afterprop);
	    } else if (type == "jsonld-keyword") {
	      return cont(afterprop);
	    } else if (type == "modifier") {
	      return cont(objprop)
	    } else if (type == "[") {
	      return cont(expression, expect("]"), afterprop);
	    } else if (type == "spread") {
	      return cont(expression);
	    } else if (type == ":") {
	      return pass(afterprop)
	    }
	  }
	  function getterSetter(type) {
	    if (type != "variable") return pass(afterprop);
	    cx.marked = "property";
	    return cont(functiondef);
	  }
	  function afterprop(type) {
	    if (type == ":") return cont(expressionNoComma);
	    if (type == "(") return pass(functiondef);
	  }
	  function commasep(what, end) {
	    function proceed(type, value) {
	      if (type == ",") {
	        var lex = cx.state.lexical;
	        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
	        return cont(function(type, value) {
	          if (type == end || value == end) return pass()
	          return pass(what)
	        }, proceed);
	      }
	      if (type == end || value == end) return cont();
	      return cont(expect(end));
	    }
	    return function(type, value) {
	      if (type == end || value == end) return cont();
	      return pass(what, proceed);
	    };
	  }
	  function contCommasep(what, end, info) {
	    for (var i = 3; i < arguments.length; i++)
	      cx.cc.push(arguments[i]);
	    return cont(pushlex(end, info), commasep(what, end), poplex);
	  }
	  function block(type) {
	    if (type == "}") return cont();
	    return pass(statement, block);
	  }
	  function maybetype(type) {
	    if (isTS && type == ":") return cont(typeexpr);
	  }
	  function maybedefault(_, value) {
	    if (value == "=") return cont(expressionNoComma);
	  }
	  function typeexpr(type) {
	    if (type == "variable") {cx.marked = "variable-3"; return cont(afterType);}
	    if (type == "{") return cont(commasep(typeprop, "}"))
	    if (type == "(") return cont(commasep(typearg, ")"), maybeReturnType)
	  }
	  function maybeReturnType(type) {
	    if (type == "=>") return cont(typeexpr)
	  }
	  function typeprop(type) {
	    if (type == "variable" || cx.style == "keyword") {
	      cx.marked = "property"
	      return cont(typeprop)
	    } else if (type == ":") {
	      return cont(typeexpr)
	    }
	  }
	  function typearg(type) {
	    if (type == "variable") return cont(typearg)
	    else if (type == ":") return cont(typeexpr)
	  }
	  function afterType(type, value) {
	    if (value == "<") return cont(commasep(typeexpr, ">"), afterType)
	    if (type == "[") return cont(expect("]"), afterType)
	  }
	  function vardef() {
	    return pass(pattern, maybetype, maybeAssign, vardefCont);
	  }
	  function pattern(type, value) {
	    if (type == "modifier") return cont(pattern)
	    if (type == "variable") { register(value); return cont(); }
	    if (type == "spread") return cont(pattern);
	    if (type == "[") return contCommasep(pattern, "]");
	    if (type == "{") return contCommasep(proppattern, "}");
	  }
	  function proppattern(type, value) {
	    if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
	      register(value);
	      return cont(maybeAssign);
	    }
	    if (type == "variable") cx.marked = "property";
	    if (type == "spread") return cont(pattern);
	    if (type == "}") return pass();
	    return cont(expect(":"), pattern, maybeAssign);
	  }
	  function maybeAssign(_type, value) {
	    if (value == "=") return cont(expressionNoComma);
	  }
	  function vardefCont(type) {
	    if (type == ",") return cont(vardef);
	  }
	  function maybeelse(type, value) {
	    if (type == "keyword b" && value == "else") return cont(pushlex("form", "else"), statement, poplex);
	  }
	  function forspec(type) {
	    if (type == "(") return cont(pushlex(")"), forspec1, expect(")"), poplex);
	  }
	  function forspec1(type) {
	    if (type == "var") return cont(vardef, expect(";"), forspec2);
	    if (type == ";") return cont(forspec2);
	    if (type == "variable") return cont(formaybeinof);
	    return pass(expression, expect(";"), forspec2);
	  }
	  function formaybeinof(_type, value) {
	    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
	    return cont(maybeoperatorComma, forspec2);
	  }
	  function forspec2(type, value) {
	    if (type == ";") return cont(forspec3);
	    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
	    return pass(expression, expect(";"), forspec3);
	  }
	  function forspec3(type) {
	    if (type != ")") cont(expression);
	  }
	  function functiondef(type, value) {
	    if (value == "*") {cx.marked = "keyword"; return cont(functiondef);}
	    if (type == "variable") {register(value); return cont(functiondef);}
	    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, maybetype, statement, popcontext);
	  }
	  function funarg(type) {
	    if (type == "spread") return cont(funarg);
	    return pass(pattern, maybetype, maybedefault);
	  }
	  function className(type, value) {
	    if (type == "variable") {register(value); return cont(classNameAfter);}
	  }
	  function classNameAfter(type, value) {
	    if (value == "extends") return cont(isTS ? typeexpr : expression, classNameAfter);
	    if (type == "{") return cont(pushlex("}"), classBody, poplex);
	  }
	  function classBody(type, value) {
	    if (type == "variable" || cx.style == "keyword") {
	      if (value == "static") {
	        cx.marked = "keyword";
	        return cont(classBody);
	      }
	      cx.marked = "property";
	      if (value == "get" || value == "set") return cont(classGetterSetter, functiondef, classBody);
	      return cont(functiondef, classBody);
	    }
	    if (value == "*") {
	      cx.marked = "keyword";
	      return cont(classBody);
	    }
	    if (type == ";") return cont(classBody);
	    if (type == "}") return cont();
	  }
	  function classGetterSetter(type) {
	    if (type != "variable") return pass();
	    cx.marked = "property";
	    return cont();
	  }
	  function afterExport(_type, value) {
	    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
	    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
	    return pass(statement);
	  }
	  function afterImport(type) {
	    if (type == "string") return cont();
	    return pass(importSpec, maybeFrom);
	  }
	  function importSpec(type, value) {
	    if (type == "{") return contCommasep(importSpec, "}");
	    if (type == "variable") register(value);
	    if (value == "*") cx.marked = "keyword";
	    return cont(maybeAs);
	  }
	  function maybeAs(_type, value) {
	    if (value == "as") { cx.marked = "keyword"; return cont(importSpec); }
	  }
	  function maybeFrom(_type, value) {
	    if (value == "from") { cx.marked = "keyword"; return cont(expression); }
	  }
	  function arrayLiteral(type) {
	    if (type == "]") return cont();
	    return pass(commasep(expressionNoComma, "]"));
	  }

	  function isContinuedStatement(state, textAfter) {
	    return state.lastType == "operator" || state.lastType == "," ||
	      isOperatorChar.test(textAfter.charAt(0)) ||
	      /[,.]/.test(textAfter.charAt(0));
	  }

	  // Interface

	  return {
	    startState: function(basecolumn) {
	      var state = {
	        tokenize: tokenBase,
	        lastType: "sof",
	        cc: [],
	        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
	        localVars: parserConfig.localVars,
	        context: parserConfig.localVars && {vars: parserConfig.localVars},
	        indented: basecolumn || 0
	      };
	      if (parserConfig.globalVars && typeof parserConfig.globalVars == "object")
	        state.globalVars = parserConfig.globalVars;
	      return state;
	    },

	    token: function(stream, state) {
	      if (stream.sol()) {
	        if (!state.lexical.hasOwnProperty("align"))
	          state.lexical.align = false;
	        state.indented = stream.indentation();
	        findFatArrow(stream, state);
	      }
	      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
	      var style = state.tokenize(stream, state);
	      if (type == "comment") return style;
	      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
	      return parseJS(state, style, type, content, stream);
	    },

	    indent: function(state, textAfter) {
	      if (state.tokenize == tokenComment) return CodeMirror.Pass;
	      if (state.tokenize != tokenBase) return 0;
	      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical;
	      // Kludge to prevent 'maybelse' from blocking lexical scope pops
	      if (!/^\s*else\b/.test(textAfter)) for (var i = state.cc.length - 1; i >= 0; --i) {
	        var c = state.cc[i];
	        if (c == poplex) lexical = lexical.prev;
	        else if (c != maybeelse) break;
	      }
	      if (lexical.type == "stat" && firstChar == "}") lexical = lexical.prev;
	      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
	        lexical = lexical.prev;
	      var type = lexical.type, closing = firstChar == type;

	      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info + 1 : 0);
	      else if (type == "form" && firstChar == "{") return lexical.indented;
	      else if (type == "form") return lexical.indented + indentUnit;
	      else if (type == "stat")
	        return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || indentUnit : 0);
	      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
	        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
	      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
	      else return lexical.indented + (closing ? 0 : indentUnit);
	    },

	    electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
	    blockCommentStart: jsonMode ? null : "/*",
	    blockCommentEnd: jsonMode ? null : "*/",
	    lineComment: jsonMode ? null : "//",
	    fold: "brace",
	    closeBrackets: "()[]{}''\"\"``",

	    helperType: jsonMode ? "json" : "javascript",
	    jsonldMode: jsonldMode,
	    jsonMode: jsonMode,

	    expressionAllowed: expressionAllowed,
	    skipExpression: function(state) {
	      var top = state.cc[state.cc.length - 1]
	      if (top == expression || top == expressionNoComma) state.cc.pop()
	    }
	  };
	});

	CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);

	CodeMirror.defineMIME("text/javascript", "javascript");
	CodeMirror.defineMIME("text/ecmascript", "javascript");
	CodeMirror.defineMIME("application/javascript", "javascript");
	CodeMirror.defineMIME("application/x-javascript", "javascript");
	CodeMirror.defineMIME("application/ecmascript", "javascript");
	CodeMirror.defineMIME("application/json", {name: "javascript", json: true});
	CodeMirror.defineMIME("application/x-json", {name: "javascript", json: true});
	CodeMirror.defineMIME("application/ld+json", {name: "javascript", jsonld: true});
	CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
	CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });

	});


/***/ }
/******/ ]);