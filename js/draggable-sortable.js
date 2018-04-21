var DRAG = {
    draggedTarget: null,
    dragged: null,
    dropzone: null,
    target: null,
    block: true,
    dropFunction: function () {},
    sortFunction: function () {},
    set: function (data) {
        this.draggedTarget = data.target !== undefined ? data.target : null;
        this.dropzone = data.target !== undefined ? data.dropzone : null;
        this.dropFunction = data.drop !== undefined ? data.drop : function () {};
        this.sortFunction = data.sort !== undefined ? data.sort : function () {};
        if (this.draggedTarget !== null && this.dropzone !== null) {
            DRAG.handler();
        }
    },
    handler: function () {
        var items = document.querySelectorAll('[draggable="true"]');
        for (var i = 0; i < items.length; i++) {
            this.setHandle(items[i]);
            this.setDropHandle(items[i].closest(DRAG.draggedTarget));
        }
    },
    setHandle: function (item) {
        item.addEventListener("click", function (event) {
            DRAG.toggle(event);
        });
        item.addEventListener("drag", function (event) {
//            event.preventDefault();
        });
        item.addEventListener("dragstart", function (event) {
            DRAG.block = false;
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text', 'id');
            DRAG.dragged = event.target.closest(DRAG.draggedTarget);
        }, false);
        item.addEventListener("dragend", function (event) {
            DRAG.sortFunction();
        }, false);
        item.addEventListener("dragover", function (event) {
            event.preventDefault();
        }, false);
        item.addEventListener("dragenter", function (event) {
            event.stopPropagation();
            DRAG.target = event.target.closest(DRAG.draggedTarget);
            DRAG.block = false;
            DRAG.sortable(DRAG.target, DRAG.dragged);
        }, false);
        item.addEventListener("dragleave", function (event) {
        }, false);
        item.addEventListener("drop", function (event) {

        }, true);
    },
    sortable: function (target, dragged) {
        if ('.' + target.className == DRAG.draggedTarget && !DRAG.block) {
            if (target.getAttribute('data-open') == "false") {
                if (DRAG.isbefore(dragged, target)) {
                    target.parentNode.insertBefore(dragged, target);
                    DRAG.block = true;
                } else {
                    target.parentNode.insertBefore(dragged, target.nextSibling);
                    DRAG.block = true;
                }
            }
        }
    },
    isbefore: function (a, b) {
        if (a.parentNode == b.parentNode) {
            for (var cur = a; cur; cur = cur.previousSibling) {
                if (cur === b) {
                    return true;
                }
            }
        }
        return false;
    },
    setDropHandle: function (item) {
        item.addEventListener("drop", function (event) {
            event.preventDefault();
            DRAG.dropFunction(this, DRAG.dragged);
            DRAG.block = true;
        }, true);
        item.addEventListener("dragover", function (event) {
            event.preventDefault();
        }, true);
    },
    checkClass: function (classname, name) {
        return new RegExp(name).test(classname)
    },
    toggle: function (event) {
        event.stopPropagation();
        var item = event.target.closest('.card');
        var open = item.getAttribute('data-open');
        open = open == 'true' ? false : true;
        var b = item.querySelector('.card-body');
        open ? b.style.display = 'block' : b.style.display = 'none';
        item.setAttribute('data-open', open);
        event.bubbles = true;
    }
}

//ie 11>
if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest =
            function (s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i,
                        el = this;
                do {
                    i = matches.length;
                    while (--i >= 0 && matches.item(i) !== el) {
                    }
                    ;
                } while ((i < 0) && (el = el.parentElement));
                return el;
            };

}