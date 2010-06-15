// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2010 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2010 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  This platform object allows you to conditionally support certain HTML5
  features.
  
  Rather than relying on the user agent, it detects whether the given elements
  and events are supported by the browser, allowing you to create much more
  robust apps.
*/
SC.platform = {
  touch: ('createTouch' in document),
  
  bounceOnScroll: (/iPhone|iPad|iPod/).test(navigator.platform),
  pinchToZoom: (/iPhone|iPad|iPod/).test(navigator.platform),

  input: {
    placeholder: (function() { return 'placeholder' in document.createElement('input'); })()
  },

  /**
    Prefix for browser specific CSS attributes.
  */
  cssPrefix: (function(){
    var userAgent = navigator.userAgent.toLowerCase();
    if ((/webkit/).test(userAgent)) return 'webkit';
    else if((/opera/).test( userAgent )) return 'opera';
    else if((/msie/).test( userAgent ) && !(/opera/).test( userAgent )) return 'ms';
    else if((/mozilla/).test( userAgent ) && !(/(compatible|webkit)/).test( userAgent )) return 'moz';
    else return null;
  })(),

  /**
    Whether the browser supports CSS transitions. Calculated later.
  */
  supportsCSSTransitions: NO,

  /**
    Whether the browser supports 2D CSS transforms. Calculated later.
  */
  supportsCSSTransforms: NO,

  /**
    Whether the browser understands 3D CSS transforms.
    This does not guarantee that the browser properly handles them.
    Calculated later.
  */
  understandsCSS3DTransforms: NO,

  /**
    Whether the browser can properly handle 3D CSS transforms. Calculated later.
  */
  supportsCSS3DTransforms: NO

};


/* Calculate transform support */

(function(){
  // a test element
  var el = document.createElement("div");

  // the css and javascript to test
  var css_browsers = ["-moz-", "-moz-", "-o-", "-ms-", "-webkit-"];
  var test_browsers = ["moz", "Moz", "o", "ms", "webkit"];

  // prepare css
  var css = "", i = null;
  for (i = 0; i < css_browsers.length; i++) {
    css += css_browsers[i] + "transition:all 1s linear;";
    css += css_browsers[i] + "transform: translate(1px, 1px);";
    css += css_browsers[i] + "perspective: 500px;";
  }

  // set css text
  el.style.cssText = css;

  // test
  for (i = 0; i < test_browsers.length; i++)
  {
    if (el.style[test_browsers[i] + "TransitionProperty"] !== undefined) SC.platform.supportsCSSTransitions = YES;
    if (el.style[test_browsers[i] + "Transform"] !== undefined) SC.platform.supportsCSSTransforms = YES;
    if (el.style[test_browsers[i] + "Perspective"] !== undefined || el.style[test_browsers[i] + "PerspectiveProperty"] !== undefined) {
      SC.platform.understandsCSS3DTransforms = YES;
      SC.platform.supportsCSS3DTransforms = YES;
    }
  }

  // unfortunately, we need a bit more to know FOR SURE that 3D is allowed
  if (window.media && window.media.matchMedium) {
    if (!window.media.matchMedium('(-webkit-transform-3d)')) SC.platform.supportsCSS3DTransforms = NO;
  } else if(window.styleMedia && window.styleMedia.matchMedium) {
    if (!window.styleMedia.matchMedium('(-webkit-transform-3d)')) SC.platform.supportsCSS3DTransforms = NO;    
  }

})();