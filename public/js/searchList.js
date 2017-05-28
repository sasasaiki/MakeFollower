/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	var searchWord = "";
	var searchPage = 0;
	var isHideFollowed = true;
	var userItemList;
	$(function ($) {
	    SetAllButtonEvent();
	    SetSearchButtonEvent();
	});
	let prevContentBottom = -10;
	$(window).scroll(function () {
	    let contentBottom = $('#x-user-list').offset().top + $('#x-user-list').height();
	    let displayBottom = $(window).scrollTop() + $(window).height();
	    if (contentBottom - displayBottom < 100) {
	        if (contentBottom == prevContentBottom) {
	            return;
	        }
	        prevContentBottom = contentBottom;
	        console.log("ページ : " + searchPage);
	        API.search('searchWord=' + searchWord + '&page=' + searchPage)
	            .done((result, textStatus, xhr) => {
	            let users = OnGetSearchedList(result);
	            SetUserList(users);
	        })
	            .always((xhr, textStatus) => {
	        })
	            .fail(() => {
	            console.log("失敗");
	        });
	    }
	});
	function OnGetSearchedList(result) {
	    let received = result;
	    let users = received.userDataArray;
	    searchPage = received.nextPage;
	    return users;
	}
	function SetUserList(users) {
	    users.forEach(user => {
	        let followButtonClass = "list-follow-button";
	        let followButtonText = "Follow";
	        if (user.is_followed) {
	            followButtonClass = "list-unfollow-button";
	            followButtonText = "UnFollow";
	        }
	        let inner = '<li>' +
	            '<div class = "list-item">' +
	            '<div>' +
	            '<div class = "list-icon" ><img class = "list-icon-img" src="' + user.profile_image_url_https + '" alt="icon"></div>' +
	            '<div class = "list-names">' +
	            '<a class = "list-name" href = "https://twitter.com/' + user.screen_name + '" >' + user.name + '</a>' +
	            '<div class = "list-screen-name">@' + user.screen_name + '</div>' +
	            '</div>' +
	            '<div class = "list-buttons" id = "list-buttons">' +
	            '<form class = "form-follower to-inline" >' +
	            '<input class = "list-to-follower-button" name = "list-button" value = "Follower" type="submit" >' +
	            '<input name = "userId" class = "hidden-user-id" value = "' + user.id + '" type="hidden" >' +
	            '</form>' +
	            '<form class = "form-follow to-inline">' +
	            '<input class = "' + followButtonClass + '" name = "list-button" value = "' + followButtonText + '" type="submit" >' +
	            '<input name = "userId" class = "hidden-user-id" value = "' + user.id + '" type="hidden" >' +
	            '</form>' +
	            '</div>' +
	            '</div>' +
	            '<div class = "list-description">' + user.description + '</div>' +
	            '</div>' +
	            '<div class = "list-border"></div>';
	        '</li>';
	        let $self = $(inner);
	        $("#x-user-list").append($self);
	        if (isHideFollowed && user.is_followed) {
	            $self.hide();
	        }
	        userItemList[user.id] = new userItemData($self, user);
	        console.log(userItemList[user.id].data.name);
	        console.log("id : " + user.id);
	        console.log("フォローしているかどうか" + user.is_followed);
	    });
	    SetFollowerButtonEvent();
	    SetFollowButtonEvent();
	}
	function SetFollowerButtonEvent() {
	    let forms = $('.form-follower');
	    forms.off('submit');
	    forms.submit(function (event) {
	        event.preventDefault();
	        var $form = $(this);
	    });
	}
	function SetFollowButtonEvent() {
	    let forms = $('.form-follow');
	    forms.off('submit');
	    forms.submit(function (event) {
	        event.preventDefault();
	        var $form = $(this);
	        FollowOrUnFollow($form);
	    });
	}
	function FollowOrUnFollow($form) {
	    var val = $form.find('.hidden-user-id').val();
	    if (userItemList[val] != null) {
	        if (userItemList[val].data.is_followed) {
	            UnFollow($form);
	        }
	    }
	    Follow($form);
	}
	function UnFollow($form) {
	}
	function Follow($form) {
	    var $button = $form.find('.list-follow-button');
	    $button.prop('disabled', true);
	    API.sendFollow($form.serialize())
	        .done((result, textStatus, xhr) => {
	        console.log("フォロー成功");
	        $form.parents("li").hide();
	    })
	        .always((xhr, textStatus) => {
	        $button.prop('disabled', false);
	    })
	        .fail(() => {
	        console.log("失敗");
	    });
	    console.log("リストボタンイベント");
	    console.log("formの中身" + $form.serialize());
	}
	function SetSearchButtonEvent() {
	    $('#form-search').submit(function (event) {
	        event.preventDefault();
	        var $form = $(this);
	        searchWord = $('#search-word').val();
	        var $button = $form.find('#search-button');
	        $button.prop('disabled', true);
	        $("#x-user-list").html('');
	        userItemList = {};
	        searchPage = 1;
	        console.log("シリアライズしたやつ　" + $form.serialize());
	        API.search($form.serialize() + '&page=' + searchPage)
	            .done((result, textStatus, xhr) => {
	            console.log("成功");
	            console.log(result);
	            let users = OnGetSearchedList(result);
	            SetUserList(users);
	        })
	            .always((xhr, textStatus) => {
	            $button.prop('disabled', false);
	        })
	            .fail(() => {
	            console.log("失敗");
	        });
	    });
	}
	function SetAllButtonEvent() {
	    let allButton = $('#all-button');
	    allButton.click(function (event) {
	        isHideFollowed = !isHideFollowed;
	        UpdateListVisible(isHideFollowed);
	    });
	}
	function UpdateListVisible(isHideFollowed) {
	    for (var key in userItemList) {
	        var userData = userItemList[key];
	        if (!isHideFollowed) {
	            userData.$element.show();
	            continue;
	        }
	        if (userData.data.is_followed) {
	            userData.$element.hide();
	        }
	        else {
	            userData.$element.show();
	        }
	    }
	}
	class API {
	    static search(data) {
	        var defer = $.Deferred();
	        $.ajax({
	            url: 'GetSearch',
	            type: 'GET',
	            data: data,
	            dataType: 'json',
	            timeout: 10000,
	            success: defer.resolve,
	            error: defer.reject
	        });
	        return defer.promise();
	    }
	    static sendFollow(data) {
	        var defer = $.Deferred();
	        $.ajax({
	            url: 'SendFollow',
	            type: 'GET',
	            data: data,
	            dataType: 'json',
	            timeout: 10000,
	            success: defer.resolve,
	            error: defer.reject
	        });
	        return defer.promise();
	    }
	}
	;
	class IDJequery {
	}
	class userItemData {
	    constructor($element, data) {
	        this.$element = $element;
	        this.data = data;
	    }
	}
	class receivedData {
	}
	class User {
	}


/***/ }
/******/ ]);
//# sourceMappingURL=../map/typeScriptMap/searchList.js.map