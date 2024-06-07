var XcellifyColumnSizeHelper = {

    xcellController: null, //required!
    columnSizedTimeout: 0,

    init: function (p_xcellController) {
        this.xcellController = p_xcellController;
        this.xcellController.columnResizer = this.columnResizer
        document.body.addEventListener('mouseup', this.columnSizedHandler.bind(this));
        this.columnSizedHandlerReally();
    },

    columnSizedHandler: function () {
        // we need to throttle this...
        clearTimeout(this.columnSizedTimeout);
        this.columnSizedTimeout = setTimeout(this.columnSizedHandlerReally.bind(this), 250);
    },

    columnSizedHandlerReally: function () {
        this.xcellController.columnResizer(this.xcellController);
    },

    columnHeading: function (text, extracssclass) {
        return Cr.elm('textarea', {
            "class": '' + (extracssclass || ''),
            readonly: 'readonly',
            rows: 1,
            events: [
                ['mousemove', this.columnSizedHandler.bind(this)],
                ['mouseup', this.columnSizedHandler.bind(this)],
                ['mouseleave', this.columnSizedHandler.bind(this)],
                ['dragend', this.columnSizedHandler.bind(this)]
            ],
            childNodes: [
                Cr.txt(text),
            ]
        })
    },

    // registered with this.xcellController
    columnResizer: function (_this) {
        var headings = _this.containerElm.querySelectorAll('.headingrow .' + _this.headingClassName);
        var cell;
        // this just applies heading sizes down the table....
        for (var h = 0, hl = headings.length; h < hl; h++) {
            for (var r = 0, y = 0, rl = _this.fullGrid.length; r < rl; r++) {
                cell = _this.fullGrid[r][h];
                if (cell) {
                    cell.closest(_this.cellSelector).style.width = headings[h].style.width;
                }
            }
        }
    }
}


/*
EXAMPLE:

    xcellInit: function () {
        var conatinerElm = getById('items_list');
        var _this = this;
        this.xcellController = new Xcellify({
            containerElm: conatinerElm,         // scope event listening and processing to a specific context, you can think <table>
            // selectors must be valid in querySelectorAll, just add a unique class to cells and rows to identify them
            cellSelector: '.xcellcell',         // must be unique to cells that contain > input.cellInputClassName (i.e not headings), (think 'td.xcellcell')
            rowSelector: '.xcellrow',           // must be unique to rows that contain the cells input.cellInputClassName (think 'tr.xcellrow', currently mandatory see rebuildIndex)
            cellInputClassName: 'xcellinput',   // input elements that have the class will be the source of keyboard and click events
            headingClassName: 'xcellheading',   // supports col and row headings, heading must be within a .rowSelector - except for top row only one allowed per row
            skipInvisibleCells: false,
            copyAreaSelector: '#copyArea',
            buttonBar: document.getElementById('xcellButtonBar'), // optional button bar already in your HTML, supported buttons: span.undo span.redo
            expandTableRows: function (rows_needed) {
                for (var x = 0; x < rows_needed; x++) {
                    conatinerElm.appendChild(_this.createItemRowFor({}, conatinerElm));
                }
                _this.xcellController.rebuildIndex(true); // rows added/removed call this!
            },
            columnResizer: XcellifyColumnSizeHelper.columnResizer
        });

        XcellifyXcellifyColumnSizeHelper.init(this.xcellController);  // this is actually all you need to do
    }


    // please note binding is tricky until you get the hang of it
    // but can alwasy be forced, using .bind(what-will-be-this)

AUXILLARY FEATURE:
we use the helper to create all the heading elements (optional) so ALL THE EVENTS will also trigger resize

    XcellifyColumnSizeHelper.columnHeading('Category'),


    which just makes the resize more "active" and less delayed... it is not perfect but is way better
    than NOT being able to resize, and can be greatly improved too...


*/
