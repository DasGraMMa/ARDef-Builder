/*
This file provides a utility instance called `Gr`.  
It provides different helper functions for kind of everything.
*/

/**
 * The Gr utility class filled to the brim with useful functions.
 * 
 * @author Marcel
 */
class Gr
{
    /**
     * Checks the given value for being `!== undefined`.
     * 
     * @param {*} val the value to check
     */
    static isDefined(val)
    {
        return val !== undefined;
    }

    /**
     * Checks the given value for being empty.
     * 
     * @param {*} val the object or array to check
     */
    static isEmpty(val)
    {
        return val == null || !(Object.keys(val) || val).length;
    }

    /**
     * Checks the given value for being a number.
     * 
     * @param {*} val the value to check
     */
    static isNumber(val)
    {
        return typeof val === "number" || Number.parseInt(val) == val || Number.parseFloat(val) == val;
    }
    
    /**
     * Deepcopys any given value and returns said copy.  
     * Guarantees: `val !== return` for each property and the value itself
     * 
     * @param {*} val the value to copy
     */
    static clone(val)
    {
        return JSON.parse(JSON.stringify(val));
    }

    /**
     * Checks the given string for being a date.  
     * Accepts the following format: `YYYY(-|.|/)MM[(-|.|/)DD]`
     * 
     * @param {string} string the string presumably containing a date
     */
    static isValidDate(string)
    {
        let dateParts = string.split(/\.|-|\//g);
        
        let date;
        switch(dateParts.length)
        {
        case 3:
            date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            
            return date.getFullYear() == dateParts[0]
                && date.getMonth() + 1 == dateParts[1];
        
        case 2:
            date = new Date(+dateParts[0], dateParts[1] - 1);

            return date.getFullYear() == dateParts[0]
                && date.getMonth() + 1 == dateParts[1];
        
        default: return false;
        }
    }

    /**
     * Checks the given string for being a time.  
     * Accepts the following format: `HH:MM:SS`
     * 
     * @param {string} string the string presumably containing a time
     */
    static isValidTime(string)
    {
        let timeParts = string.split(":").map(val => +val);

        return timeParts[0] >= 0 && timeParts[0] < 24
            && timeParts[1] >= 0 && timeParts[1] < 60
            && timeParts[2] >= 0 && timeParts[2] < 60;
    }

    /**
     * Checks a string for being a valid url and if so, returns an array with the parts
     * of the string corresponding to the url.  
     * Structured as follows: `["http://example.com/hello/world?cool=yes", "example.com", "/hello/world?cool=yes"]` 
     * 
     * @param {String} string the string to check for being a url
     */
    static checkForValidUrl(string)
    {
        // Regex by Diego Perini (https://gist.github.com/dperini/729294)
        // Modified for capturing url parts.
        const regex = /^(?:(?:(?:https?|ftp):)?\/\/)((?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?)))(?::\d{2,5})?([/?#]\S*)?$/i;

        return regex.exec(string);
    }

    /**
     * Checks a string for being a valid url.
     * 
     * @param {String} string the string to check for being a url
     */
    static isValidUrl(string)
    {
        return Gr.checkForValidUrl(string) != null;
    }
    
    /**
     * Capitalizes the given string.
     * 
     * @param {String} string the string to capitalize
     * @param {boolean} perToken whether to capizalize all individual tokens
     */
    static capitalize(string, perToken = false)
    {
        const cap = str => str.charAt(0).toUpperCase() + str.slice(1);

        return perToken ? string.split(" ").map(tok => cap(tok)).join(" ") : cap(string);
    }

    /**
     * Returns an URLSearchParams instance for a given string or the current query.
     * 
     * @param {string} string the string to return a search params instance for (or null for the current browser search)
     */
    static searchParams(string = null)
    {
        string = string || window.location.search;
        return new URLSearchParams(string);
    }

    /**
     * Clamps a number to a given range.  
     * Mathematically, value will be [min, max] after the transformation.
     * 
     * @param {Number} min the minimal value
     * @param {Number} num the value to clamp
     * @param {Number} max the maximum value
     */
    static clamp(min, num, max)
    {
        return Math.min(max, Math.max(min, num));
    }

    /**
     * Swaps elements of an array at i and j and returns it.
     * 
     * @param {Array} array the array to swap the elements of
     * @param {Number} i the first index
     * @param {Number} j the second index
     */
    static swap(array, i, j)
    {
        [ array[i], array[j] ] = [ array[j], array[i] ];
        return array;
    }

    /**
     * Removes elements that match a given predicate from a given array.
     * 
     * @template T
     * @param {Array.<T>} array the array to remove from
     * @param {function(T,Number,Array.<T>):boolean} predicate the condition under which to remove elements; parameters are the current value, the current index and the array
     * @returns {Number} the number of removed items
     */
    static removeIf(array, predicate)
    {
        let i = array.length,
            removeCount = 0;
        while(i--)
        {
            if(predicate(array[i], i, array))
            {
                array.splice(i, 1);
                removeCount++;
            }
        }
        return removeCount;
    }

    /**
     * Checks the array for exactly one element which fulfills the condition.
     * 
     * @template T
     * @param {Array.<T>} array the array to check for the condition
     * @param {function(T, Number, Array.<T>):boolean} predicate the condition to check each element for; parameters are current value, current index and the array itself
     * @returns {boolean} true, iff only exactly one element fulfills the condition, false otherwise
     */
    static exactlyOne(array, predicate)
    {
        return array.filter(predicate).length == 1;
    }

    /**
     * Checks the given array for any duplicate values.
     * 
     * @param {Array} array the array to check for duplicates
     */
    static hasDuplicates(array)
    {
        return new Set(array).size !== array.length;
    }

    /**
     * Converts the given array into a dsv-string, separated
     * by comma by default.
     * 
     * @param {Array<Array>} array the array to reduce to a dsv
     * @param {String} delimiter the delimiter to use, "," if omitted
     */
    static arrayToDsv(array, delimiter = ",")
    {
        return array.map(inner => inner.map(val => `"${val}"`).join(delimiter)).join("\n");
    }

    /**
     * Creates and returns an html-element described by the argument.  
     * Attributes: `id:*`, `classes:String|Array`, `attr:{name: value}`, `html:String`, `text:String`, `parent:Node`
     * 
     * @param {String} tagname the tagname to create
     * @param {*} elObj an object with the element structure to create
     */
    static element(tagname, elObj)
    {
        let _ret = document.createElement(tagname);

        if(Gr.isDefined(elObj.id)) _ret.id = elObj.id;

        if(Gr.isDefined(elObj.classes)) _ret.className = elObj.classes instanceof Array ? elObj.classes.join(" ") : elObj.classes;

        if(Gr.isDefined(elObj.attr)) for(let curAttr of Object.keys(elObj.attr)) _ret.setAttribute(curAttr, elObj.attr[curAttr]);

        if(Gr.isDefined(elObj.html)) _ret.innerHTML = elObj.html;
        if(Gr.isDefined(elObj.text)) _ret.innerText = elObj.text;

        if(Gr.isDefined(elObj.parent)) elObj.parent.appendChild(_ret);

        return _ret;
    }

    /**
     * Clears an element's children.
     * 
     * @param {HTMLElement} element the element to remove the children from
     * @param {function(HTMLElement):boolean} cond the condition to check for each element (when true, gets removed)
     */
    static clearChildren(element, cond = () => true)
    {
        for(let i = element.children.length - 1; i >= 0; i--)
        {
            if(cond(element.children[i])) element.removeChild(element.children[i]);
        }
    }

    /**
     * Stops the given event from propagating to other
     * event handlers whenever this method gets called.
     * 
     * @param {Event} event the event to stop
     */
    static stopEvent(event)
    {
        event.stopPropagation();
        event.preventDefault();
    }
    
    /**
     * Returns a function for d3 that truncates the given text (via function)
     * to the given width (via function) and puts it inside of the given svg element.
     * 
     * @param {function(*, Number):string} textFn the function which makes the text for given data
     * @param {function(*, Number):Number} widthFn the function which returns the maximum width for given data
     */
    static truncateText(textFn, widthFn)
    {
        return (d, i, g) =>
        {
            const svgTextEl = g[i];
            let text = svgTextEl.textContent = textFn(d, i),
                maxWidth = widthFn(d, i);
            
            // Already short enough, just return the text.
            if(svgTextEl.getComputedTextLength() < maxWidth) return text;

            // Simulate the longest text it can be and setup the loop.
            svgTextEl.textContent = "…" + text;
            let lo = 0,
                hi = text.length + 1;
            
            while(lo < hi)
            {
                // Try and half the text and see whether it fits.
                var mid = lo + hi >> 1;
                if(svgTextEl.getSubStringLength(0, mid) < maxWidth) lo = mid + 1;
                else hi = mid;
            }

            // Either return the truncated text or nothing if it didn't fit.
            return lo > 1 ? text.substr(0, lo - 2) + "…" : "";
        };
    }

    /**
     * Makes an ajax request using the given method to a given url with given data if desired.
     * 
     * @param {string} method the method to make a request with
     * @param {string} url the url to make a request at
     * @param {string} data the data to send with the request
     */
    static ajaxRequest(method, url, data = null)
    {
        return new Promise(function(resolve, reject)
        {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = function()
            {
                if (this.status >= 200 && this.status < 300)
                {
                    resolve(xhr.response);
                }
                else
                {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function()
            {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };

            xhr.send(data);
        });
    }
}

/*
In case document is defined, add methods regarding the document.
*/
if(typeof document !== "undefined")
{
    /** @type {function(string): HTMLElement} */
    Gr.$ = document.querySelector.bind(document);
    /** @type {function(string): Array.<HTMLElement>} */
    Gr.$$ = document.querySelectorAll.bind(document);
}

/*
In case d3 is defined, add some utility-functions that can be used for different stuff.
*/
if(typeof d3 !== "undefined")
{
    Gr.d3 =
    {
        /**
         * Returns a function that can invert a d3 bandscale.
         * 
         * @param {d3.ScaleBand} scale the bandscale to invert
         */
        scaleBandInvert: function(scale)
        {
            const domain = scale.domain(),
                bandStep = scale.step();
            const pOuter = scale(domain[0]);

            return (val) => Gr.clamp(0, Math.floor((val - pOuter) / bandStep), domain.length - 1);
        }
    };
}

/**
 * This flag shows whether methods which extend JS prototypes should be applied as well.
 * Sometimes it is desirable not to modify prototypes.
 * All of these methods have counterparts in Gr.
 */
Gr.EXTENSION_METHODS = true;

if(Gr.EXTENSION_METHODS)
{
    /**
     * Checks this string for being a valid date representation.
     */
    String.prototype.isValidDate = function()
    {
        return Gr.isValidDate(this);
    }

    /**
     * Checks this string for being a valid time representation.
     */
    String.prototype.isValidTime = function()
    {
        return Gr.isValidTime(this);
    }

    /**
     * Checks this string for being a valid url and if so, returns its parts.
     */
    String.prototype.checkForValidUrl = function()
    {
        return Gr.checkForValidUrl(this);
    }

    /**
     * Checks this string for being a valid url string.
     */
    String.prototype.isValidUrl = function()
    {
        return Gr.isValidUrl(this);
    }

    /**
     * Capitalizes this string and returns a copy.
     * 
     * @param {boolean} perToken whether to capitalize each token individually
     */
    String.prototype.capitalize = function(perToken = false)
    {
        return Gr.capitalize(this, perToken);
    }

    /**
     * Swaps the elements at i and j in this array.
     * 
     * @param {Number} i index 1
     * @param {Number} j index 2
     */
    Array.prototype.swap = function(i, j)
    {
        return Gr.swap(this, i, j);
    }

    /**
     * Removes elements that match a given predicate.
     * 
     * @param {function(*,Number,Array):boolean} predicate the condition under which to remove elements; parameters are the current value, the current index and this
     * @returns {Number} the number of removed items
     */
    Array.prototype.removeIf = function(predicate)
    {
        return Gr.removeIf(this, predicate);
    }

    /**
     * Checks for exactly one element which fulfills the condition.
     * 
     * @param {function(*, Number, Array):boolean} predicate the condition to check each element for; parameters are current value, current index and the array itself
     * @returns {boolean} true, iff only exactly one element fulfills the condition, false otherwise
     */
    Array.prototype.exactlyOne = function(predicate)
    {
        return Gr.exactlyOne(this, predicate);
    }

    /**
     * Checks this array for having duplicate values.
     */
    Array.prototype.hasDuplicates = function()
    {
        return Gr.hasDuplicates(this);
    }

    /**
     * Converts this array into a dsv-string, separated by comma by default.
     */
    Array.prototype.toDsv = function(delimiter = ",")
    {
        return Gr.arrayToDsv(this, delimiter);
    }
}

/** Serves as a flag to check in which mode we are. */
Gr.DEBUG_MODE = !Gr.searchParams().has("debugOff");

// Add the logging methods.
if(Gr.DEBUG_MODE)
{
    Gr.log = console.log;
    /** @type { function(any, ...): void } */
    Gr.logSection = console.log.bind(window.console, "%c %s ", "background-color: #333; color: #6f6; font-weight: bold; font-size: 1.25em;");
    /** @type { function(any, ...): void } */
    Gr.logImportant = console.log.bind(window.console, "%c %s ", "font-weight: bold; font-size: 1.1em;");

    Gr.table = console.table;
    Gr.error = console.error;
    Gr.warn = console.warn;
    Gr.trace = console.trace;
}
else
{
    // Remove log functions when not in debug mode.
    Gr.log = function() {};
    Gr.logSection = function() {};
    Gr.logImportant = function() {};

    Gr.table = function() {};
    Gr.error = function() {};
    Gr.warn = function() {};
    Gr.trace = function() {};
}

/**
 * The tests testing the testable methods from the Gr class.
 * Will be set to an empty object when not using debug mode.
 */
Gr.Tests = !Gr.DEBUG_MODE ? {} : {
    isDefined: function()
    {
        console.assert(!Gr.isDefined(undefined), "undefined should not be defined.");
        console.assert(Gr.isDefined(null), "null should be defined.");
        console.assert(Gr.isDefined("some string"), "A string should be defined");
        console.assert(Gr.isDefined(NaN), "NaN should be defined.");
    },

    isEmpty: function()
    {
        console.assert(Gr.isEmpty(undefined), "undefined should be empty.");
        console.assert(Gr.isEmpty(null), "null should be empty.");
        console.assert(Gr.isEmpty([]), "An empty array should be empty.");
        console.assert(Gr.isEmpty({}), "An empty object should be empty.");
        
        console.assert(!Gr.isEmpty("a string"), "A string should not be empty.");
        console.assert(!Gr.isEmpty({ prop: "cool" }), "An object with a property should not be empty");
        console.assert(!Gr.isEmpty(["cool", "values"]), "An array with two values should not be empty.");
    },

    runAll: function()
    {
        for(let method of Object.getOwnPropertyNames(this))
        {
            if(method != "runAll")
            {
                console.group(method);
                this[method]();
                console.groupEnd();
            }
        }
    }
}

export { Gr };
