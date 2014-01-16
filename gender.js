/*!
 * gender.js v0.3
 * Copyright 2014 gender-api.com
 * http://www.apache.org/licenses/LICENSE-2.0
 */
(function ($) {
    $.fn.genderApi = function (config) {

        var $this = $(this);
        var block = false;  //only 1 request at a time
        var timeout = 500; // 500 ms
        var timer = null;
        var currentQuery = null;

        var startTimer = function () {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(parse, timeout);
        }

        var data = {
            ip: 'auto'
        };

        if (config.key) {
            data.key = config.key;
        }

        if (config.country) {
            data.country = config.country;
        }

        if (config.language) {
            data.language = config.language;
        }

        var protocol = 'https:' == document.location.protocol ? 'https://' : 'http://';
        var url = config.url ? config.url : protocol + 'gender-api.com/get';

        var parse = function () {
            var value = $.trim($this.val());
            if (value.length > 1) {

                data.name = value;

                if (block == true) return;
                if (value == currentQuery) return;

                block = true;
                currentQuery = value;

                if (!$.support.cors && $.ajaxTransport && window.XDomainRequest) {

                    var xdr = new XDomainRequest();
                    if (xdr) {

                        if (window.location && window.location.href) {
                            data.ref = window.location.href;
                        }

                        xdr.onload = function () {
                            var result = $.parseJSON(xdr.responseText);
                            if (result && result.gender) {
                                $this.trigger('gender-found', result);
                            }
                            block = false;
                        };

                        var dataString = '';
                        $.each(data, function (key, value) {
                            dataString += '&' + key + '=' + encodeURIComponent(value);
                        });

                        xdr.open("get", url + '?' + dataString.substr(1));
                        xdr.send();
                    }

                } else {
                    $.ajax({
                        url: url,
                        data: data,
                        dataType: 'json'
                    }).
                        done(function (result) {
                            if (result.gender) {
                                $this.trigger('gender-found', result);
                            }
                            block = false;
                        });
                }
            }
        }

        $this.on({
            'change': parse,
            'focusout': parse,
            'keyup': startTimer,
            'paste': function () {
                setTimeout(parse, 100)
            }
        });

        return this;
    }
})
    (jQuery);