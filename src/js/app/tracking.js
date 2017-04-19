/**
 * Created by Cloud on 2015/11/29.
 */
var gaTrackingData = {
    1: ['LFT','Age-Gate'],
    2: ['LFT','Join'],
    3: ['LFT','Start'],
    4: ['LFT','Invitation-SMS-Code'],
    5: ['LFT','Invitation-Next-Step'],
    6: ['LFT','Invitation-Date'],
    7: ['LFT','Invitation-Time'],
    8: ['LFT','Invitation-Get'],
    9: ['LFT','Invitation-Address'],
    10: ['LFT','Invitation-Follow'],
    11: ['LFT','Failure-Replay'],
    12: ['LFT','Failure-Sharing'],
    //LFT-Trade
    13:['LFT-Trade','Invitation-Get'],
    14:['LFT-Trade','LuckyDraw'],
    15:['LFT-Trade','LuckyDraw-Replay'],
    16:['LFT-Trade','LuckyDraw-NextStep'],
    17:['LFT-Trade','LuckyDraw-Sharing'],

    //UGC
    18:['UGC','Start-Mirror'],
    19:['UGC','Photo-Confirm'],
    20:['UGC','Photo-Cancel'],
    21:['UGC','Icon-Select'],
    22:['UGC','Icon-Generate'],
    23:['UGC','Icon-Cancel'],
    24:['UGC','Sharing'],
    25:['UGC','Replay'],

    31:['GetPhoto','Photo-Selfie'],
    32:['GetPhoto','Photo-Cool'],
    33:['GetPhoto','SMS-Code'],
    34:['GetPhoto','Get-Party-Look'],
    35:['GetPhoto','Sharing'],
    36:['GetPhoto','Sharing-Selfie'],

    41:['GetDrink','Get-Noblige'],
    42:['GetDrink','Get-Cocktail'],
    43:['GetDrink','Drink-1'],
    44:['GetDrink','Drink-2'],
    45:['GetDrink','Msg-Source'],
    46:['GetDrink','Sharing-Cocktail'],
    47:['GetDrink','Sharing-Noblige']
}

//$(function () {
//    eventTracking();
//});

function eventTracking() {
    if (browser.versions.mobile) {
        $(document).off("touchstart").on("touchstart", "[data-ga]", function () {
            var index = $(this).attr("data-ga");
            datapush(gaTrackingData[index]);
        });
    } else {
        $(document).off("click").on("click", "[data-ga]", function () {
            var index = $(this).attr("data-ga");
            datapush(gaTrackingData[index]);
        });
    }
}

function datapush(action) {
    //ga tracking
    try {
        if (typeof ga) {
            action.length == 2 && (ga('send', 'event', action[0], $.trim(action[1])));
            action.length == 3 && (ga('send', 'event', action[0], $.trim(action[1]), $.trim(action[2])));
        }

        if(window.location.href.indexOf("shanghai.html")!=-1 && window.location.href.indexOf("noshanghai.html")==-1 ){
            window._CiQ11493 = window._CiQ11493 || [];
            window._CiQ11493.push(['_trackEvent', {
                type: 1,
                labels: [
                    {"按钮名称": $.trim(action[1])}
                ],
                values: [
                    {"数量": 1 }
                ]
            }]);
            //应用立即发送数据方法
            window.CClickiV3 && window.CClickiV3[11202] && window.CClickiV3[11202]._flushObserver(function(){});
        }

        if(window.location.href.indexOf("noshanghai.html")!=-1 ) {
            window._CiQ11495 = window._CiQ11495 || [];
            window._CiQ11495.push(['_trackEvent', {
                type: 1,
                labels: [
                    {'按钮名称': $.trim(action[1])}
                ],
                values: [
                    {'数量': 1}
                ]
            }]);
            window.CClickiV3 && window.CClickiV3[11495] && window.CClickiV3[11495]._flushObserver(function () {
            });
        }
        if (window.console) console.log(action);

    } catch (Ex) {
    }
    //Gridsum tracking
    //if (window._gsTracker) {
    //    _gsTracker.trackEvent("April2014EffC", $.trim(action), "Mobile");
    //}
}
