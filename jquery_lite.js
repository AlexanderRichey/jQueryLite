(function (root) {

  root.$l = function (selector) { // selector instance of HTMLelement ("<li>")
    var executionQueue = [];

    if (selector instanceof HTMLElement) {
      var obj = [selector];
      return new DOMNodeCollection(obj);
    } else if (typeof selector === "function") {
      executionQueue.push(selector);
    } else {
      var selection = document.querySelectorAll(selector); //("li")
      var newDom = new DOMNodeCollection(Array.from(selection));
      return newDom;
    }

    document.addEventListener("DOMContentLoaded", function(event) {
      for (var i = 0; i < executionQueue.length; i++) {
        executionQueue[i]();
      }
    });
  };


  var DOMNodeCollection = function (array) {
    this.htmlElements = array;
  };

  DOMNodeCollection.prototype.html = function (string) {
    if (typeof string === "undefined") {
      return this.htmlElements[0].innerHTML;
    } else {
      for (var i = 0; i < this.htmlElements.length; i++) {
        this.htmlElements[i].innerHTML = string;
      }
    }
  };

  DOMNodeCollection.prototype.empty = function () {
    this.html("");
  };

  DOMNodeCollection.prototype.append = function (item) {
    if (typeof item === "string") {
      this.html(this.html() + item);
    } else if (item instanceof HTMLElement) {
      this.html(this.html() + item.outerHTML);
    } else {
      this.html(this.html() + item.html());
    }
  };


  DOMNodeCollection.prototype.attr = function (attribute, value) {
    if (typeof value === "undefined") {
      return this.htmlElements[0].attributes[attribute];
    } else {
      for (var i = 0; i < this.htmlElements.length; i++) {
        this.htmlElements[i].attributes[attribute] = value;
      }
    }
  };

  DOMNodeCollection.prototype.addClass = function (className) {
    for (var i = 0; i < this.htmlElements.length; i++) {
      this.htmlElements[i].classList.add(className);
    }
  };

  DOMNodeCollection.prototype.removeClass = function (className) {
    for (var i = 0; i < this.htmlElements.length; i++) {
      this.htmlElements[i].classList.remove(className);
    }
  };

  DOMNodeCollection.prototype.children = function () {
    var allChildren = [];

    for (var i = 0; i < this.htmlElements.length; i++) {
      allChildren.push(this.htmlElements[i].children);
    }

    return new DOMNodeCollection(allChildren);
  };


  DOMNodeCollection.prototype.parent = function () {
    var parent = this.htmlElements[0].parentElement;
    return new DOMNodeCollection([parent]);
  };

  DOMNodeCollection.prototype.find = function (selector) {
    var descendants = [];

    for (var i = 0; i < this.htmlElements.length; i++) {
      descendants.push(this.htmlElements[i].querySelectorAll(selector));
    }

    return new DOMNodeCollection(descendants);

  };

  DOMNodeCollection.prototype.remove = function () {
    for (var i = 0; i < this.htmlElements.length; i++) {
      this.htmlElements[i].parentElement.removeChild(this.htmlElements[i]);
    }
  };

  DOMNodeCollection.prototype.on = function (event, callback) {
    for (var i = 0; i < this.htmlElements.length; i++) {
      this.htmlElements[i].addEventListener(event, callback);
    }
  };

  DOMNodeCollection.prototype.off = function (event, callback) {
    for (var i = 0; i < this.htmlElements.length; i++) {
      this.htmlElements[i].removeEventListener(event, callback);
    }
  };

  $l.extend = function (args) {
    var arrArgs = Array.prototype.slice.call(arguments);
    var first = arrArgs.shift();

    for (var i = 0; i < arrArgs.length; i++) {
      for (var key in arrArgs[i]) {
        first[key] = arrArgs[i][key];
      }
    }

    return first;
  };

  $l.ajax = function (options) {
    defaultOptions = {
      method: "GET",
      url: "#",
      data: "",
      contentType: "",
      success: "",
      error: ""
    };

    var requestOptions = $l.extend(defaultOptions, options);
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == XMLHttpRequest.DONE) {
         if (xmlhttp.status == 200) {
           requestOptions.success(xmlhttp.responseText);
         } else if (xmlhttp.status == 400) {
          requestOptions.error(xmlhttp.responseText);
         } else {
          alert('something else other than 200 was returned');
         }
      }
    };

    xmlhttp.open(requestOptions.method, requestOptions.url, true);
    xmlhttp.send();
  };


})(this);





















//
