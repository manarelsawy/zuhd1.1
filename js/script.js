/**
 * Global variabless
 */
"use strict";

var userAgent = navigator.userAgent.toLowerCase(),
    initialDate = new Date(),

    $document = $(document),
    $window = $(window),
    $html = $("html"),
    $body = $("body"),

    isDesktop = $html.hasClass("desktop"),
    isRtl = $html.attr("dir") === "rtl",
    isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    onloadCaptchaCallback,
    switchingColorMap = {
      "Primary": "#b6c062"
    },
    plugins = {
      pointerEvents: isIE && isIE < 11 ? 'js/pointer-events.min.js' : false,
      bootstrapTooltip: $("[data-toggle='tooltip']"),
      timePicker: $(".rd-mailform-time-picker"),
      datePicker: $('.form-input[type="date"]'),
      dropdownSelect: $(".rd-mailform-select"),
      flickrfeed: $('.flickr'),
      filePicker: $('.rd-file-picker'),
      fileDrop: $('.rd-file-drop'),
      popover: $('[data-toggle="popover"]'),
      calendar: $('.rd-calendar'),
      rdNavbar: $(".rd-navbar"),
      materialParallax: $(".parallax-container"),
      rdGoogleMaps: $(".rd-google-map"),
      rdMailForm: $(".rd-mailform"),
      rdInputLabel: $(".form-label"),
      regula: $("[data-constraints]"),
      captcha: $('.recaptcha'),
      search: $('.rd-navbar-search'),
      video: $(".rd-video"),
      instafeed: $('.instafeed'),
      twitterfeed: $('.twitter'),
      facebookfeed: $('.facebook'),
      materialTabs: $('.rd-material-tabs'),
      responsiveTabs: $(".responsive-tabs"),
      navTabs: $('.nav-tabs'),
      textRotator: $(".rotator"),
      mfp: $('[data-lightbox]').not('[data-lightbox="gallery"] [data-lightbox]'),
      mfpGallery: $('[data-lightbox^="gallery"]'),
      wow: $(".wow"),
      owl: $('.owl-carousel'),
      dateCountdown: $('.DateCountdown'),
      statefulButton: $('.btn-stateful'),
      countDown: $('.countdown'),
      counter: $('.counter'),
      viewAnimate: $('.view-animate'),
      progressBar: $('.progress-bar'),
      swiper: $(".swiper-slider"),
      isotope: $(".isotope"),
      facebookplugin: $('#fb-root'),
      audioPlayer: $('.rd-audio'),
      slick: $('.carousel-slider'),
      scroller: $(".scroll-wrap"),
      copyrightYear: $(".copyright-year"),
      socialite: $(".socialite")
    },
    i = 0;
/**
 * Initialize All Scripts
 */
$document.ready(function () {

  var isNoviBuilder = window.xMode;

  /**
   * getSwiperHeight
   * @description  calculate the height of swiper slider basing on data attr
   */
  function getSwiperHeight(object, attr) {
    var val = object.attr("data-" + attr),
      dim;

    if (!val) {
      return undefined;
    }

    dim = val.match(/(px)|(%)|(vh)|(vw)$/i);

    if (dim.length) {
      switch (dim[0]) {
        case "px":
          return parseFloat(val);
        case "vh":
          return $window.height() * (parseFloat(val) / 100);
        case "vw":
          return $window.width() * (parseFloat(val) / 100);
        case "%":
          return object.width() * (parseFloat(val) / 100);
      }
    } else {
      return undefined;
    }
  }

  /**
   * toggleSwiperInnerVideos
   * @description  toggle swiper videos on active slides
   */
  function toggleSwiperInnerVideos(swiper) {
    var prevSlide = $(swiper.slides[swiper.previousIndex]),
      nextSlide = $(swiper.slides[swiper.activeIndex]),
      videos,
      videoItems = prevSlide.find("video");

    for (var i = 0; i < videoItems.length; i++) {
      videoItems[i].pause();
    }

    videos = nextSlide.find("video");
    if (videos.length) {
      videos.get(0).play();
    }
  }

  /**
   * toggleSwiperCaptionAnimation
   * @description  toggle swiper animations on active slides
   */
  function toggleSwiperCaptionAnimation(swiper) {
    var prevSlide = $(swiper.container).find("[data-caption-animate]"),
      nextSlide = $(swiper.slides[swiper.activeIndex]).find("[data-caption-animate]"),
      delay,
      duration,
      nextSlideItem,
      prevSlideItem;

    for (var i = 0; i < prevSlide.length; i++) {
      prevSlideItem = $(prevSlide[i]);

      prevSlideItem.removeClass("animated")
        .removeClass(prevSlideItem.attr("data-caption-animate"))
        .addClass("not-animated");
    }


    var tempFunction = function (nextSlideItem, duration) {
      return function () {
        nextSlideItem
          .removeClass("not-animated")
          .addClass(nextSlideItem.attr("data-caption-animate"))
          .addClass("animated");
        if (duration) {
          nextSlideItem.css('animation-duration', duration + 'ms');
        }
      };
    };

    for (var i = 0; i < nextSlide.length; i++) {
      nextSlideItem = $(nextSlide[i]);
      delay = nextSlideItem.attr("data-caption-delay");
      duration = nextSlideItem.attr('data-caption-duration');
      setTimeout(tempFunction(nextSlideItem, duration), delay ? parseInt(delay, 10) : 0);
    }
  }

  /**
   * Material Parallax
   * @description Enables Material Parallax plugin
   */
  if (plugins.materialParallax.length) {
    var i;

    if (!isNoviBuilder && !isIE && !isMobile) {
      plugins.materialParallax.parallax();
    } else {
      for (i = 0; i < plugins.materialParallax.length; i++) {
        var parallax = $(plugins.materialParallax[i]),
          imgPath = parallax.data("parallax-img");

        parallax.css({
          "background-image": 'url(' + imgPath + ')',
          "background-attachment": "fixed",
          "background-size": "cover"
        });
      }
    }
  }

  function preventScroll(e) {
    e.preventDefault();
  }

  /**
   * isScrolledIntoView
   * @description  check the element whas been scrolled into the view
   */
  function isScrolledIntoView(elem) {
    if (!isNoviBuilder) {
      return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
    }
    else {
      return true;
    }
  }

  /**
   * initOnView
   * @description  calls a function when element has been scrolled into the view
   */
  function lazyInit(element, func) {
    $document.on('scroll', function () {
      if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
        func.call();
        element.addClass('lazy-loaded');
      }
    }).trigger("scroll");
  }

  /**
   * attachFormValidator
   * @description  attach form validation to elements
   */
  function attachFormValidator(elements) {
    for (var i = 0; i < elements.length; i++) {
      var o = $(elements[i]), v;
      o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
      v = o.parent().find(".form-validation");
      if (v.is(":last-child")) {
        o.addClass("form-control-last-child");
      }
    }

    elements
      .on('input change propertychange blur', function (e) {
        var $this = $(this), results;

        if (e.type !== "blur") {
          if (!$this.parent().hasClass("has-error")) {
            return;
          }
        }

        if ($this.parents('.rd-mailform').hasClass('success')) {
          return;
        }

        if ((results = $this.regula('validate')).length) {
          for (i = 0; i < results.length; i++) {
            $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
          }
        } else {
          $this.siblings(".form-validation").text("").parent().removeClass("has-error")
        }
      })
      .regula('bind');

    var regularConstraintsMessages = [
      {
        type: regula.Constraint.Required,
        newMessage: "The text field is required."
      },
      {
        type: regula.Constraint.Email,
        newMessage: "The email is not a valid email."
      },
      {
        type: regula.Constraint.Numeric,
        newMessage: "Only numbers are required"
      },
      {
        type: regula.Constraint.Selected,
        newMessage: "Please choose an option."
      }
    ];


    for (var i = 0; i < regularConstraintsMessages.length; i++) {
      var regularConstraint = regularConstraintsMessages[i];

      regula.override({
        constraintType: regularConstraint.type,
        defaultMessage: regularConstraint.newMessage
      });
    }
  }

  /**
   * isValidated
   * @description  check if all elemnts pass validation
   */
  function isValidated(elements, captcha) {
    var results, errors = 0;

    if (elements.length) {
      for (var j = 0; j < elements.length; j++) {

        var $input = $(elements[j]);
        if ((results = $input.regula('validate')).length) {
          for (k = 0; k < results.length; k++) {
            errors++;
            $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
          }
        } else {
          $input.siblings(".form-validation").text("").parent().removeClass("has-error")
        }
      }

      if (captcha) {
        if (captcha.length) {
          return validateReCaptcha(captcha) && errors === 0
        }
      }

      return errors === 0;
    }
    return true;
  }

  /**
   * Init Bootstrap tooltip
   * @description  calls a function when need to init bootstrap tooltips
   */
  function initBootstrapTooltip(tooltipPlacement) {
    if (window.innerWidth < 576) {
      plugins.bootstrapTooltip.tooltip('dispose');
      plugins.bootstrapTooltip.tooltip({
        placement: 'bottom'
      });
    } else {
      plugins.bootstrapTooltip.tooltip('dispose');
      plugins.bootstrapTooltip.tooltip({
        placement: tooltipPlacement
      });
    }
  }

  /**
   * validateReCaptcha
   * @description  validate google reCaptcha
   */
  function validateReCaptcha(captcha) {
    var captchaToken = captcha.find('.g-recaptcha-response').val();

    if (captchaToken.length === 0) {
      captcha
        .siblings('.form-validation')
        .html('Please, prove that you are not robot.')
        .addClass('active');
      captcha
        .closest('.form-wrap')
        .addClass('has-error');

      captcha.on('propertychange', function () {
        var $this = $(this),
          captchaToken = $this.find('.g-recaptcha-response').val();

        if (captchaToken.length > 0) {
          $this
            .closest('.form-wrap')
            .removeClass('has-error');
          $this
            .siblings('.form-validation')
            .removeClass('active')
            .html('');
          $this.off('propertychange');
        }
      });

      return false;
    }

    return true;
  }


  /**
   * onloadCaptchaCallback
   * @description  init google reCaptcha
   */
  window.onloadCaptchaCallback = function () {
    for (var i = 0; i < plugins.captcha.length; i++) {
      var $capthcaItem = $(plugins.captcha[i]);

      grecaptcha.render(
        $capthcaItem.attr('id'),
        {
          sitekey: $capthcaItem.attr('data-sitekey'),
          size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
          theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
          callback: function (e) {
            $('.recaptcha').trigger('propertychange');
          }
        }
      );
      $capthcaItem.after("<span class='form-validation'></span>");
    }
  };

  /**
   * Google ReCaptcha
   * @description Enables Google ReCaptcha
   */
  if (plugins.captcha.length) {
    $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
  }

  /**
   * Copyright Year
   * @description  Evaluates correct copyright year
   */
  if (plugins.copyrightYear.length) {
    plugins.copyrightYear.text(initialDate.getFullYear());
  }

  /**
   * IE Polyfills
   * @description  Adds some loosing functionality to IE browsers
   */
  if (isIE) {
    if (isIE < 10) {
      $html.addClass("lt-ie-10");
    }

    if (isIE < 11) {
      if (plugins.pointerEvents) {
        $.getScript(plugins.pointerEvents)
          .done(function () {
            $html.addClass("ie-10");
            PointerEventsPolyfill.initialize({});
          });
      }
    }

    if (isIE === 11) {
      $html.addClass("ie-11");
    }

    if (isIE === 12) {
      $html.addClass("ie-edge");
    }
  }

  /**
   * Bootstrap Tooltips
   * @description Activate Bootstrap Tooltips
   */
  if (plugins.bootstrapTooltip.length) {
    var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
    initBootstrapTooltip(tooltipPlacement);

    $window.on('resize orientationchange', function () {
      initBootstrapTooltip(tooltipPlacement);
    })
  }

  /**
   * @module     RD Audio Player
   * @author     Rafael Shayvolodyan
   * @see        https://ua.linkedin.com/in/rafael-shayvolodyan-3a297b96
   * @version    1.0.0
   * @License    under dual CC By-SA 4.0 and GPLv3
   */
  if (plugins.audioPlayer.length > 0) {
    for (i = 0; i < plugins.audioPlayer.length; i++) {
      var audioPlayerItem = plugins.audioPlayer[i];
      $(audioPlayerItem).RDAudio({});
    }
  }

  /**
   * RD Input Label
   * @description Enables RD Input Label Plugin
   */
  if (plugins.rdInputLabel.length) {
    plugins.rdInputLabel.RDInputLabel();
  }


  /**
   * Regula
   * @description Enables Regula plugin
   */
  if (plugins.regula.length) {
    attachFormValidator(plugins.regula);
  }

  /**
   * RD Mailform
   * @version      3.2.0
   */
  if (plugins.rdMailForm.length) {
    var i, j, k,
      msg = {
        'MF000': 'Successfully sent!',
        'MF001': 'Recipients are not set!',
        'MF002': 'Form will not work locally!',
        'MF003': 'Please, define email field in your form!',
        'MF004': 'Please, define type of your form!',
        'MF254': 'Something went wrong with PHPMailer!',
        'MF255': 'Aw, snap! Something went wrong.'
      };

    for (i = 0; i < plugins.rdMailForm.length; i++) {
      var $form = $(plugins.rdMailForm[i]),
        formHasCaptcha = false;

      $form.attr('novalidate', 'novalidate').ajaxForm({
        data: {
          "form-type": $form.attr("data-form-type") || "contact",
          "counter": i
        },
        beforeSubmit: function (arr, $form, options) {
          if (isNoviBuilder)
            return;

          var form = $(plugins.rdMailForm[this.extraData.counter]),
            inputs = form.find("[data-constraints]"),
            output = $("#" + form.attr("data-form-output")),
            captcha = form.find('.recaptcha'),
            captchaFlag = true;

          output.removeClass("active error success");

          if (isValidated(inputs, captcha)) {

            // veify reCaptcha
            if (captcha.length) {
              var captchaToken = captcha.find('.g-recaptcha-response').val(),
                captchaMsg = {
                  'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
                  'CPT002': 'Something wrong with google reCaptcha'
                };

              formHasCaptcha = true;

              $.ajax({
                method: "POST",
                url: "bat/reCaptcha.php",
                data: {'g-recaptcha-response': captchaToken},
                async: false
              })
                .done(function (responceCode) {
                  if (responceCode !== 'CPT000') {
                    if (output.hasClass("snackbars")) {
                      output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

                      setTimeout(function () {
                        output.removeClass("active");
                      }, 3500);

                      captchaFlag = false;
                    } else {
                      output.html(captchaMsg[responceCode]);
                    }

                    output.addClass("active");
                  }
                });
            }

            if (!captchaFlag) {
              return false;
            }

            form.addClass('form-in-process');

            if (output.hasClass("snackbars")) {
              output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
              output.addClass("active");
            }
          } else {
            return false;
          }
        },
        error: function (result) {
          if (isNoviBuilder)
            return;

          var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
            form = $(plugins.rdMailForm[this.extraData.counter]);

          output.text(msg[result]);
          form.removeClass('form-in-process');

          if (formHasCaptcha) {
            grecaptcha.reset();
          }
        },
        success: function (result) {
          if (isNoviBuilder)
            return;

          var form = $(plugins.rdMailForm[this.extraData.counter]),
            output = $("#" + form.attr("data-form-output")),
            select = form.find('select');

          form
            .addClass('success')
            .removeClass('form-in-process');

          if (formHasCaptcha) {
            grecaptcha.reset();
          }

          result = result.length === 5 ? result : 'MF255';
          output.text(msg[result]);

          if (result === "MF000") {
            if (output.hasClass("snackbars")) {
              output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
            } else {
              output.addClass("active success");
            }
          } else {
            if (output.hasClass("snackbars")) {
              output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
            } else {
              output.addClass("active error");
            }
          }

          form.clearForm();

          if (select.length) {
            select.select2("val", "");
          }

          form.find('input, textarea').trigger('blur');

          setTimeout(function () {
            output.removeClass("active error success");
            form.removeClass('success');
          }, 3500);
        }
      });
    }
  }

  /**
   * @module       Text rotator
   * @version      1.0.0
   * @license      MIT license
   */
  if (plugins.textRotator.length) {
    for (i = 0; i < plugins.textRotator.length; i++) {
      var textRotatorItem = plugins.textRotator[i];
      $(textRotatorItem).rotator();
    }
  }

  /**
   * @module       Magnific Popup
   * @author       Dmitry Semenov
   * @see          http://dimsemenov.com/plugins/magnific-popup/
   * @version      v1.0.0
   */
  if (plugins.mfp.length > 0 || plugins.mfpGallery.length > 0) {
    if (plugins.mfp.length) {
      for (i = 0; i < plugins.mfp.length; i++) {
        var mfpItem = plugins.mfp[i];

        $(mfpItem).magnificPopup({
          type: mfpItem.getAttribute("data-lightbox")
        });
      }
    }
    if (plugins.mfpGallery.length) {
      for (i = 0; i < plugins.mfpGallery.length; i++) {
        var mfpGalleryItem = $(plugins.mfpGallery[i]).find('[data-lightbox]');

        for (var c = 0; c < mfpGalleryItem.length; c++) {
          $(mfpGalleryItem).addClass("mfp-" + $(mfpGalleryItem).attr("data-lightbox"));
        }

        mfpGalleryItem.end()
            .magnificPopup({
              delegate: '[data-lightbox]',
              type: "image",
              gallery: {
                enabled: true
              }
            });
      }
    }
  }

  /**
   * RD Google Maps
   * @description Enables RD Google Maps plugin
   */
  if (plugins.rdGoogleMaps.length) {
    $.getScript("//maps.google.com/maps/api/js?key=AIzaSyAwH60q5rWrS8bXwpkZwZwhw9Bw0pqKTZM&sensor=false&libraries=geometry,places&v=3.7", function () {
      var head = document.getElementsByTagName('head')[0],
        insertBefore = head.insertBefore;

      head.insertBefore = function (newElement, referenceElement) {
        if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') !== -1 || newElement.innerHTML.indexOf('gm-style') !== -1) {
          return;
        }
        insertBefore.call(head, newElement, referenceElement);
      };

      for (var i = 0; i < plugins.rdGoogleMaps.length; i++) {
        var $googleMapItem = $(plugins.rdGoogleMaps[i]);

        lazyInit($googleMapItem, $.proxy(function () {
          var $this = $(this),
            styles = $this.attr("data-styles");

          $this.googleMap({
            marker: {
              basic: $this.data('marker'),
              active: $this.data('marker-active')
            },
            styles: styles ? JSON.parse(styles) : [],
            onInit: function (map) {
              var inputAddress = $('#rd-google-map-address');


              if (inputAddress.length) {
                var input = inputAddress;
                var geocoder = new google.maps.Geocoder();
                var marker = new google.maps.Marker(
                  {
                    map: map,
                    icon: $this.data('marker-url')
                  }
                );

                var autocomplete = new google.maps.places.Autocomplete(inputAddress[0]);
                autocomplete.bindTo('bounds', map);
                inputAddress.attr('placeholder', '');
                inputAddress.on('change', function () {
                  $("#rd-google-map-address-submit").trigger('click');
                });
                inputAddress.on('keydown', function (e) {
                  if (e.keyCode === 13) {
                    $("#rd-google-map-address-submit").trigger('click');
                  }
                });


                $("#rd-google-map-address-submit").on('click', function (e) {
                  e.preventDefault();
                  var address = input.val();
                  geocoder.geocode({'address': address}, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                      var latitude = results[0].geometry.location.lat();
                      var longitude = results[0].geometry.location.lng();

                      map.setCenter(new google.maps.LatLng(
                        parseFloat(latitude),
                        parseFloat(longitude)
                      ));
                      marker.setPosition(new google.maps.LatLng(
                        parseFloat(latitude),
                        parseFloat(longitude)
                      ))
                    }
                  });
                });
              }
            }
          });
        }, $googleMapItem));
      }
    });
  }

  /**
   * @module       RD Timepicker
   * @author       Aleksey Patsurkovskiy
   * @version      1.0.2
   * @license      MIT License
   * @link         http://cms.devoffice.com/coding-demo/mnemon1k/rd-timepicker/demo/
   */
  if (plugins.timePicker.length) {
    for (i = 0; i < plugins.timePicker.length; i++) {
      var timePickerItem = plugins.timePicker[i];
      $(timePickerItem).RDTimePicker();
    }
  }

  /**
   * @module       Responsive Tabs
   * @description  Enables Easy Responsive Tabs Plugin
   */
  if (plugins.responsiveTabs.length) {

    plugins.responsiveTabs.each(function () {
      var $this = $(this);
      $this.easyResponsiveTabs({
        type: $this.attr("data-type") === "accordion" ? "accordion" : "default"
      });
    })

  }

  /**
   * @module       RD Instafeed
   * @author       Rafael Shayvolodyan(raffa)
   * @see          https://ua.linkedin.com/in/rafael-shayvolodyan-3a297b96
   * @version      1.0.1
   * @License      under dual CC By-SA 4.0 and GPLv3
   */
  if (plugins.instafeed.length > 0) {
    for (i = 0; i < plugins.instafeed.length; i++) {
      var instafeedItem = plugins.instafeed[i];
      $(instafeedItem).RDInstafeed({});
    }
  }

  /**
   * @module       RD Twitter Feed
   * @author       Rafael Shayvolodyan(raffa)
   * @see          https://ua.linkedin.com/in/rafael-shayvolodyan-3a297b96
   * @version      1.0.0
   * @License      under dual CC By-SA 4.0 and GPLv3
   */
  if (plugins.twitterfeed.length > 0) {
    for (i = 0; i < plugins.twitterfeed.length; i++) {
      var twitterfeedItem = plugins.twitterfeed[i];
      $(twitterfeedItem).RDTwitter({});
    }
  }

  /**
   * @module       RD MaterialTabs
   * @author       Rafael Shayvolodyan
   * @see          https://ua.linkedin.com/in/rafael-shayvolodyan-3a297b96
   * @version      1.0.2
   * @License      under dual CC By-SA 4.0 and GPLv3
   */
  if (plugins.materialTabs.length) {
    for (i = 0; i < plugins.materialTabs.length; i++) {
      var materialTabsItem = plugins.materialTabs[i];
      $(materialTabsItem).RDMaterialTabs({});
    }
  }

  /**
   * @module       RD FacebookFeed
   * @author       Rafael Shayvolodyan
   * @see          https://ua.linkedin.com/in/rafael-shayvolodyan-3a297b96
   * @version      1.0.0
   */
  if (plugins.facebookfeed.length > 0) {
    for (i = 0; i < plugins.facebookfeed.length; i++) {
      var facebookfeedItem = plugins.facebookfeed[i];
      $(facebookfeedItem).RDFacebookFeed({});
    }
  }

  /**
   * @module       Official Faceboock iframe
   */
  if (plugins.facebookplugin.length) {
    for (i = 0; i < plugins.facebookplugin.length; i++) {

      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/ru_RU/sdk.js#xfbml=1&version=v2.5";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  }

  /**
   * @module       RD Flickr Gallery
   * @author       Rafael Shayvolodyan
   * @see          https://ua.linkedin.com/in/rafael-shayvolodyan-3a297b96
   * @version      1.0.0
   * @License      under dual CC By-SA 4.0 and GPLv3
   */
  if (plugins.flickrfeed.length > 0) {
    for (i = 0; i < plugins.flickrfeed.length; i++) {
      var flickrfeedItem = plugins.flickrfeed[i];
      $(flickrfeedItem).RDFlickr({});
    }
  }

  /**
   * @module       RD SelectMenu
   * @author       Evgeniy Gusarov
   * @version      1.0.2
   * @license      MIT License
   * @link         http://cms.devoffice.com/coding-dev/rd-selectmenu/demo/
   */
  if (plugins.dropdownSelect.length) {
    for (i = 0; i < plugins.dropdownSelect.length; i++) {
      var dropdownSelectItem = plugins.dropdownSelect[i];
      $(dropdownSelectItem).RDSelectMenu();
    }
  }

  /**
   * @module       RD Toggles
   * @author       Aleksey Patsurvkoskiy
   * @version      0.2.1
   * @license      MIT License
   * @link         http://cms.devoffice.com/coding-demo/mnemon1k/rd-toggle/demo/
   */
  if ($.length) {
    $.RDToggles();
  }

  /**
   * @module       RD DatePicker
   * @author       Evgeniy Gusarov
   * @version      1.0.2
   * @license      MIT License
   * @link         http://cms.devoffice.com/coding-dev/rd-datepicker/demo/
   */
  if (plugins.datePicker.length) {
    for (i = 0; i < plugins.datePicker.length; i++) {
      var datePickerItem = plugins.datePicker[i];
      $(datePickerItem).RDDatePicker();
    }
  }

  /**
   * @module       RD Filepicker
   * @author       Aleksey Patsurkovskiy
   * @version      1.0.2
   * @license      MIT License
   * @link         http://cms.devoffice.com/coding-demo/mnemon1k/rd-filepicker/demo/
   */
  if (plugins.filePicker.length || plugins.fileDrop.length) {
    for (i = 0; i < plugins.filePicker.length; i++) {
      var filePickerItem = plugins.filePicker[i];

      $(filePickerItem).RDFilepicker({
        metaFieldClass: "rd-file-picker-meta"
      });
    }

    for (i = 0; i < plugins.fileDrop.length; i++) {
      var fileDropItem = plugins.fileDrop[i];

      $(fileDropItem).RDFilepicker({
        metaFieldClass: "rd-file-drop-meta",
        buttonClass: "rd-file-drop-btn",
        dropZoneClass: "rd-file-drop"
      });
    }
  }

  /**
   * Popovers
   * @description Enables Popovers plugin
   */
  if (plugins.popover.length) {
    if (window.innerWidth < 767) {
      plugins.popover.attr('data-placement', 'bottom');
      plugins.popover.popover();
    }
    else {
      plugins.popover.popover();
    }
  }

  /**
   * @module       Countdown
   * @author       Keith Wood
   * @see          http://keith-wood.name/countdown.html
   * @license      MIT License
   */
  if (plugins.countDown.length) {
    for (i = 0; i < plugins.countDown.length; i++) {
      var countDownItem = plugins.countDown[i],
          d = new Date(),
          type = countDownItem.getAttribute('data-type'),
          time = countDownItem.getAttribute('data-time'),
          format = countDownItem.getAttribute('data-format'),
          settings = [];

      d.setTime(Date.parse(time)).toLocaleString();
      settings[type] = d;
      settings['format'] = format;
      $(countDownItem).countdown(settings);
    }
  }

  /**
   * @module     TimeCircles
   * @author     Wim Barelds
   * @version    1.5.3
   * @see        http://www.wimbarelds.nl/
   * @license    MIT License
   */
  if (plugins.dateCountdown.length) {
    for (i = 0; i < plugins.dateCountdown.length; i++) {
      var dateCountdownItem = $(plugins.dateCountdown[i]),
          time = {
            "Days": {
              "text": "Days",
              "color": "#FFF",
              "show": true
            },
            "Hours": {
              "text": "Hours",
              "color": "#fff",
              "show": true
            },
            "Minutes": {
              "text": "Minutes",
              "color": "#fff",
              "show": true
            },
            "Seconds": {
              "text": "Seconds",
              "color": "#fff",
              "show": true
            }
          };
      dateCountdownItem.TimeCircles({});
      $(window).on('load resize orientationchange', function () {
        if (window.innerWidth < 479) {
          dateCountdownItem.TimeCircles({
            time: {
              Minutes: {show: true},
              Seconds: {show: false}
            }
          }).rebuild();
        } else if (window.innerWidth < 767) {
          dateCountdownItem.TimeCircles({
            time: {
              Seconds: {show: false}
            }
          }).rebuild();
        } else {
          dateCountdownItem.TimeCircles({time: time}).rebuild();
        }
      });
    }
  }

  /**
   * @module      Buttons
   * @author      Twitter, Inc.
   * @version     3.3.6
   * @link        https://github.com/twbs/bootstrap/blob/master/js/button.js
   * @license     MIT License
   */
  if (plugins.statefulButton.length) {
    $(plugins.statefulButton).on('click', function () {
      var statefulButtonLoading = $(this).button('loading');

      setTimeout(function () {
        statefulButtonLoading.button('reset')
      }, 2000);
    })
  }

  /**
   * @module       RD Calendar
   * @author       Evgeniy Gusarov
   * @see          https://ua.linkedin.com/pub/evgeniy-gusarov/8a/a40/54a
   * @version      1.0.0
   */
  if (plugins.calendar.length) {
    for (i = 0; i < plugins.calendar.length; i++) {
      var calendarItem = $(plugins.calendar[i]);

      calendarItem.rdCalendar({
        days: calendarItem.attr("data-days") ? calendarItem.attr("data-days").split(/\s?,\s?/i) : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        month: calendarItem.attr("data-months") ? calendarItem.attr("data-months").split(/\s?,\s?/i) : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      });
    }
  }

  /**
   * @module      ProgressBar.js
   * @see         https://kimmobrunfeldt.github.io/progressbar.js
   * @license:    MIT License
   * @version     0.9.0
   */
  if (plugins.progressBar.length) {
    var bar,
        type;
    for (i = 0; i < plugins.progressBar.length; i++) {
      var progressItem = plugins.progressBar[i];
      bar = null;
      if (
          progressItem.className.indexOf("progress-bar-horizontal") > -1
      ) {
        type = 'Line';
      }

      if (
          progressItem.className.indexOf("progress-bar-radial") > -1
      ) {
        type = 'Circle';
      }

      if (progressItem.getAttribute("data-stroke") && progressItem.getAttribute("data-value") && type) {
        bar = new ProgressBar[type](progressItem, {
          strokeWidth: Math.round(parseFloat(progressItem.getAttribute("data-stroke")) / progressItem.offsetWidth * 100)
          ,
          trailWidth: progressItem.getAttribute("data-trail") ? Math.round(parseFloat(progressItem.getAttribute("data-trail")) / progressItem.offsetWidth * 100) : 0
          ,
          text: {
            value: progressItem.getAttribute("data-counter") === "true" ? '0' : null
            , className: 'progress-bar__body'
            , style: null
          }
        });
        bar.svg.setAttribute('preserveAspectRatio', "none meet");
        if (type === 'Line') {
          bar.svg.setAttributeNS(null, "height", progressItem.getAttribute("data-stroke"));
        }

        bar.path.removeAttribute("stroke");
        bar.path.className.baseVal = "progress-bar__stroke";
        if (bar.trail) {
          bar.trail.removeAttribute("stroke");
          bar.trail.className.baseVal = "progress-bar__trail";
        }

        if (progressItem.getAttribute("data-easing") && !isIE) {
          $(document)
              .on("scroll", {"barItem": bar}, $.proxy(function (event) {
                var bar = event.data.barItem;
                if (isScrolledIntoView($(this)) && this.className.indexOf("progress-bar--animated") === -1) {
                  this.className += " progress-bar--animated";
                  bar.animate(parseInt(this.getAttribute("data-value")) / 100.0, {
                    easing: this.getAttribute("data-easing")
                    ,
                    duration: this.getAttribute("data-duration") ? parseInt(this.getAttribute("data-duration")) : 800
                    ,
                    step: function (state, b) {
                      if (b._container.className.indexOf("progress-bar-horizontal") > -1 ||
                          b._container.className.indexOf("progress-bar-vertical") > -1) {
                        b.text.style.width = Math.abs(b.value() * 100).toFixed(0) + "%"
                      }
                      b.setText(Math.abs(b.value() * 100).toFixed(0));
                    }
                  });
                }
              }, progressItem))
              .trigger("scroll");
        } else {
          bar.set(parseInt(this.getAttribute("data-value")) / 100.0);
          bar.setText(this.getAttribute("data-value"));
          if (type === 'Line') {
            bar.text.style.width = parseInt(this.getAttribute("data-value")) + "%";
          }
        }
      } else {
        console.error(progressItem.className + ": progress bar type is not defined");
      }
    }
  }

  /**
   * UI To Top
   * @description Enables ToTop Button
   */
  if (isDesktop && !isNoviBuilder) {
    $().UItoTop({
      easingType: 'easeOutQuad',
      containerClass: 'ui-to-top fa fa-angle-up'
    });
  }

  /**
   * RD Navbar
   * @description Enables RD Navbar plugin
   */
  if (plugins.rdNavbar.length) {
    var aliaces, i, j, len, value, values, responsive2;

    aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"];
    values = [0, 576, 768, 992, 1200, 1600];
    responsive2 = {};

    for (i = j = 0, len = values.length; j < len; i = ++j) {
      value = values[i];
      if (plugins.rdNavbar.attr('data' + aliaces[i] + 'layout')) {
        if (!responsive2[values[i]]) {
          responsive2[values[i]] = {};
        }
        responsive2[values[i]].layout = plugins.rdNavbar.attr('data' + aliaces[i] + 'layout');
      }
      if (plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout')) {
        if (!responsive2[values[i]]) {
          responsive2[values[i]] = {};
        }
        responsive2[values[i]]['deviceLayout'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'device-layout');
      }
      if (plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on')) {
        if (!responsive2[values[i]]) {
          responsive2[values[i]] = {};
        }
        responsive2[values[i]]['focusOnHover'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'hover-on') === 'true';
      }
      if (plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height')) {
        if (!responsive2[values[i]]) {
          responsive2[values[i]] = {};
        }
        responsive2[values[i]]['autoHeight'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'auto-height') === 'true';
      }
      if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up')) {
        if (!responsive2[values[i]]) {
          responsive2[values[i]] = {};
        }
        responsive2[values[i]]['stickUp'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up') === 'true';
      }
      if (plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset')) {
        if (!responsive2[values[i]]) {
          responsive2[values[i]] = {};
        }
        responsive2[values[i]]['stickUpOffset'] = plugins.rdNavbar.attr('data' + aliaces[i] + 'stick-up-offset');
      }
    }


    plugins.rdNavbar.RDNavbar({
      anchorNav: !isNoviBuilder,
      stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
      responsive: responsive2,
      callbacks: {
        onStuck: function () {
          var navbarSearch = this.$element.find('.rd-search input');

          if (navbarSearch) {
            navbarSearch.val('').trigger('propertychange');
          }
        },
        onDropdownOver: function () {
          return !isNoviBuilder;
        },
        onUnstuck: function () {
          if (this.$clone === null)
            return;

          var navbarSearch = this.$clone.find('.rd-search input');

          if (navbarSearch) {
            navbarSearch.val('').trigger('propertychange');
            navbarSearch.trigger('blur');
          }

        }
      }
    });


    if (plugins.rdNavbar.attr("data-body-class")) {
      document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
    }
  }

  /**
   * ViewPort Universal
   * @description Add class in viewport
   */
  if (plugins.viewAnimate.length) {
    for (var i = 0; i < plugins.viewAnimate.length; i++) {
      var $view = $(plugins.viewAnimate[i]).not('.active');
      $document.on("scroll", $.proxy(function () {
        if (isScrolledIntoView(this)) {
          this.addClass("active");
        }
      }, $view))
        .trigger("scroll");
    }
  }

  /**
   * Swiper
   * @description  Enable Swiper Slider
   */
  if (plugins.swiper.length) {
    for (var i = 0; i < plugins.swiper.length; i++) {
      var s = $(plugins.swiper[i]);
      var pag = s.find(".swiper-pagination"),
        next = s.find(".swiper-button-next"),
        prev = s.find(".swiper-button-prev"),
        bar = s.find(".swiper-scrollbar"),
        swiperSlide = s.find(".swiper-slide"),
        autoplay = false;

      for (var j = 0; j < swiperSlide.length; j++) {
        var $this = $(swiperSlide[j]),
          url;

        if (url = $this.attr("data-slide-bg")) {
          $this.css({
            "background-image": "url(" + url + ")",
            "background-size": "cover"
          })
        }
      }

      swiperSlide.end()
        .find("[data-caption-animate]")
        .addClass("not-animated")
        .end();

      s.swiper({
        autoplay: s.attr('data-autoplay') ? s.attr('data-autoplay') === "false" ? undefined : s.attr('data-autoplay') : 5000,
        direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
        effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
        speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
        keyboardControl: s.attr('data-keyboard') === "true",
        mousewheelControl: s.attr('data-mousewheel') === "true",
        mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
        nextButton: next.length ? next.get(0) : null,
        prevButton: prev.length ? prev.get(0) : null,
        pagination: pag.length ? pag.get(0) : null,
        paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
        paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function (swiper, index, className) {
          return '<span class="' + className + '">' + (index + 1) + '</span>';
        } : null : null,
        scrollbar: bar.length ? bar.get(0) : null,
        scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
        scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
        loop: isNoviBuilder ? false : s.attr('data-loop') !== "false",
        simulateTouch: s.attr('data-simulate-touch') && !isNoviBuilder ? s.attr('data-simulate-touch') === "true" : false,
        onTransitionStart: function (swiper) {
          toggleSwiperInnerVideos(swiper);
        },
        onTransitionEnd: function (swiper) {
          toggleSwiperCaptionAnimation(swiper);
        },
        onInit: function (swiper) {
          toggleSwiperInnerVideos(swiper);
          toggleSwiperCaptionAnimation(swiper);
        }
      });

      $window.on("resize", (function (s) {
        return function () {
          var mh = getSwiperHeight(s, "min-height"),
            h = getSwiperHeight(s, "height");
          if (h) {
            s.css("height", mh ? mh > h ? mh : h : h);
          }
        }
      })(s)).trigger("resize");
    }
  }

  /**
   * @module       RD Video
   * @author       Rafael Shayvolodyan
   * @see          https://ua.linkedin.com/in/rafael-shayvolodyan-3a297b96
   * @version      1.0.0
   */
  if (plugins.video.length) {
    for (i = 0; i < plugins.video.length; i++) {
      var videoItem = plugins.video[i];
      $(videoItem).RDVideo({});
    }
  }

  /**
   * @module       Search Plugin
   * @version      1.0.0
   * @author       Evgeniy Gusarov (Stmechanus | Diversant)
   * @license      The MIT License (MIT)
   */
  if (plugins.search.length) {
    for (i = 0; plugins.search.length; i++) {
      var searchItem = plugins.search[i];
      $(searchItem).RDSearch({});
    }
  }

  /**
   * @module       Slick carousel
   * @version      1.5.9
   * @author       Ken Wheeler
   * @license      The MIT License (MIT)
   */
  if (plugins.slick.length) {
    for (i = 0; i < plugins.slick.length; i++) {
      var $slickItem = $(plugins.slick[i]);

      $slickItem.slick({});
    }
  }

  /**
   * @module       Owl carousel
   * @version      2.0.0
   * @author       Bartosz Wojciechowski
   * @license      The MIT License (MIT)
   */
  if (plugins.owl.length) {
    for (i = 0; i < plugins.owl.length; i++) {
      var c = $(plugins.owl[i]),
          responsive = {};

      var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-"],
          values = [0, 480, 768, 992, 1200],
          j, k;

      for (j = 0; j < values.length; j++) {
        responsive[values[j]] = {};
        for (k = j; k >= -1; k--) {
          if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
            responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"));
          }
          if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
            responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"));
          }
          if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
            responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"));
          }
        }
      }

      c.owlCarousel({
        autoplay: c.attr("data-autoplay") === "true",
        loop: c.attr("data-loop") !== "false",
        items: 1,
        dotsContainer: c.attr("data-pagination-class") || false,
        navContainer: c.attr("data-navigation-class") || false,
        mouseDrag: c.attr("data-mouse-drag") !== "false",
        nav: c.attr("data-nav") === "true",
        dots: c.attr("data-dots") === "true",
        dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each")) : false,
        responsive: responsive,
        navText: [],
        onInitialized: function () {
          if ($.fn.magnificPopup) {
            var o = this.$element.attr('data-lightbox') !== undefined && this.$element.attr("data-lightbox") !== "gallery",
                g = this.$element.attr('data-lightbox') === "gallery";
            if (o) {
              for (var m = 0; m < (this.$element).length; m++) {
                var $this = $(this.$element[m]);
                $this.magnificPopup({
                  type: $this.attr("data-lightbox"),
                  callbacks: {
                    open: function () {
                      if (isTouch) {
                        $document.on("touchmove", preventScroll);
                        $document.swipe({
                          swipeDown: function () {
                            $.magnificPopup.close();
                          }
                        });
                      }
                    },
                    close: function () {
                      if (isTouch) {
                        $document.off("touchmove", preventScroll);
                        $document.swipe("destroy");
                      }
                    }
                  }
                });
              }
            }
            if (g) {
              for (var k = 0; k < (this.$element).length; k++) {
                var $gallery = $(this.$element[k]).find('[data-lightbox]');
                for (var j = 0; j < $gallery.length; j++) {
                  var $item = $gallery[j];
                  $item.addClass("mfp-" + $item.attr("data-lightbox"));
                }
                $gallery.end()
                    .magnificPopup({
                      delegate: '.owl-item [data-lightbox]',
                      type: "image",
                      gallery: {
                        enabled: true
                      },
                      callbacks: {
                        open: function () {
                          if (isTouch) {
                            $document.on("touchmove", preventScroll);
                            $document.swipe({
                              swipeDown: function () {
                                $.magnificPopup.close();
                              }
                            });
                          }
                        },
                        close: function () {
                          if (isTouch) {
                            $document.off("touchmove", preventScroll);
                            $document.swipe("destroy");
                          }
                        }
                      }
                    });
              }
            }
          }
          if (c.attr("data-active")) {
            c.trigger("to.owl.carousel", c.attr("data-active") - 1);
          }
        }
      });
    }
  }

  /**
   * @module     jQuery Count To
   * @author     Matt Huggins
   * @see        https://github.com/mhuggins/jquery-countTo
   * @license    MIT License
   */
  if (plugins.counter.length) {
    for (i = 0; i < plugins.counter.length; i++) {
      var counterNotAnimated = plugins.counter.not(".animated");

      $document.on("scroll", function () {
        for (i = 0; i < counterNotAnimated.length; i++) {
          var counterNotAnimatedItem = $(counterNotAnimated[i]);
          if ((!counterNotAnimatedItem.hasClass("animated")) && (isScrolledIntoView(counterNotAnimatedItem))) {
            counterNotAnimatedItem.countTo({
              refreshInterval: 40,
              speed: counterNotAnimatedItem.attr("data-speed") || 1000
            });
            counterNotAnimatedItem.addClass('animated');
          }
        }
      });
      $document.trigger("scroll");
    }
  }

  /**
   * Isotope
   * @description Enables Isotope plugin
   */
  if (plugins.isotope.length) {
    var isogroup = [];
    for (var i = 0; i < plugins.isotope.length; i++) {
      var isotopeItem = plugins.isotope[i],
        isotopeInitAttrs = {
          itemSelector: '.isotope-item',
          layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
          filter: '*'
        };

      if (isotopeItem.getAttribute('data-column-width')) {
        isotopeInitAttrs.masonry = {
          columnWidth: parseFloat(isotopeItem.getAttribute('data-column-width'))
        };
      } else if (isotopeItem.getAttribute('data-column-class')) {
        isotopeInitAttrs.masonry = {
          columnWidth: isotopeItem.getAttribute('data-column-class')
        };
      }

      var iso = new Isotope(isotopeItem, isotopeInitAttrs);
      isogroup.push(iso);
    }


    setTimeout(function () {
      var i;
      for (i = 0; i < isogroup.length; i++) {
        isogroup[i].element.className += " isotope--loaded";
        isogroup[i].layout();
      }
    }, 600);

    var resizeTimout;

    $("[data-isotope-filter]").on("click", function (e) {
      e.preventDefault();
      var filter = $(this);
      clearTimeout(resizeTimout);
      filter.parents(".isotope-filters").find('.active').removeClass("active");
      filter.addClass("active");
      var iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]'),
        isotopeAttrs = {
          itemSelector: '.isotope-item',
          layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
          filter: this.getAttribute("data-isotope-filter") === '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]'
        };
      if (iso.attr('data-column-width')) {
        isotopeAttrs.masonry = {
          columnWidth: parseFloat(iso.attr('data-column-width'))
        };
      } else if (iso.attr('data-column-class')) {
        isotopeAttrs.masonry = {
          columnWidth: iso.attr('data-column-class')
        };
      }
      iso.isotope(isotopeAttrs);
    }).eq(0).trigger("click")
  }

  /**
   * WOW
   * @description Enables Wow animation plugin
   */
  if ($html.hasClass("wow-animation") && plugins.wow.length && !isNoviBuilder && isDesktop) {
    new WOW().init();
  }

  /**
   * @module       Bootstrap tabs
   * @author       Twitter, Inc.
   * @license      MIT License
   * @version      3.3.6
   * @link         https://github.com/twbs/bootstrap/blob/master/js/tab.js
   */
  if (plugins.navTabs.length) {
    for (i = 0; i < plugins.navTabs.length; i++) {
      var navTabsItem = $(plugins.navTabs[i]);

      navTabsItem.on("click", "a", function (event) {
        event.preventDefault();
        $(this).tab('show');
      });
    }
  }
  /**
   * @module       jquery mousewheel plugin
   * @description  Enables jquery mousewheel plugin
   */
  if (plugins.scroller.length) {
    for (i = 0; i < plugins.scroller.length; i++) {
      var scrollerItem = $(plugins.scroller[i]);

      scrollerItem.mCustomScrollbar({
        scrollInertia: 200,
        scrollButtons: {enable: true}
      });
    }
  }

  /**
   * @module       Socialite v2
   * @description  Enables Socialite v2 plugin
   */
  if (plugins.socialite.length) {
    Socialite.load();
  }
});

