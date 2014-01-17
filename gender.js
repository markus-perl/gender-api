/*!
 * gender.js v0.4
 * Copyright 2014 gender-api.com
 * https://github.com/markus-perl/gender-api/blob/master/LICENSE
 */
(function ($) {

    var GenderApi = function (element, config) {

        var $this = $(element);

        var block = false;  //only 1 request at a time
        var timeout = 500; // 500 ms
        var timer = null;
        var currentQuery = null;
        var attached = true; //enables or disables the detection

        /**
         * Can be called to disable detection
         * $(element).genderApi('detach');
         */
        $this.detachApi = function () {
            attached = false;
        }

        /**
         * Can be called to enable detection
         * $(element).genderApi('attach');
         */
        $this.attachApi = function () {
            attached = true;
        }

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
            if (value.length > 1 && attached) {

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

        $this.data('genderapi', $this);
    }

    $.fn.genderApi = function (config) {

        return this.each(function () {
            var api = $(this).data('genderapi');

            switch (config) {
                case 'detach':
                    if (api) {
                        api.detachApi();
                    }
                    return;
                case 'attach':
                    if (api) {
                        api.attachApi();
                    }
                    return;
            }

            return new GenderApi(this, config);
        });
    }
})
    (jQuery);