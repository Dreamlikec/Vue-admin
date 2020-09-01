"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateParamsfun = validateParamsfun;

var _compositionApi = require("@vue/composition-api");

var _elementUi = require("element-ui");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 对各个参数进行验证
function validateParamsfun() {
  var _reactive;

  var ParamsData = (0, _compositionApi.reactive)((_reactive = {
    coldRegion: ["北京", "青岛", "徐州", "临沂"],
    shwcRegion: ["南京", "武汉", "长沙", "上海"],
    shwwRegion: ["深圳"],
    coldRegionData: {
      AC: {
        min: 0.1,
        max: 0.5
      },
      uw: {
        min: 0.4,
        max: 0.6
      },
      uf: {
        min: 1,
        max: 3
      },
      shgc: {
        min: 0.4,
        max: 0.6
      },
      glz_n: {
        min: 0.2,
        max: 0.3
      },
      glz_ew: {
        min: 0.2,
        max: 0.35
      },
      glz_s: {
        min: 0.2,
        max: 0.5
      },
      sum_point: {
        min: 25,
        max: 27
      },
      win_point: {
        min: 18,
        max: 22
      }
    },
    shwcRegionData: {
      AC: {
        min: 0.1,
        max: 1
      },
      uw: {
        min: 0.6,
        max: 1
      },
      uf: {
        min: 1,
        max: 3
      },
      shgc: {
        min: 0.4,
        max: 0.6
      },
      glz_n: {
        min: 0.2,
        max: 0.4
      },
      glz_ew: {
        min: 0.2,
        max: 0.35
      },
      glz_s: {
        min: 0.2,
        max: 0.45
      },
      sum_point: {
        min: 25,
        max: 27
      },
      win_point: {
        min: 18,
        max: 22
      }
    }
  }, _defineProperty(_reactive, "shwwRegion", {
    AC: {
      min: 0.1,
      max: 1
    },
    uw: {
      min: 1,
      max: 2
    },
    uf: {
      min: 1,
      max: 3
    },
    shgc: {
      min: 0.4,
      max: 0.6
    },
    glz_n: {
      min: 0.2,
      max: 0.4
    },
    glz_ew: {
      min: 0.2,
      max: 0.3
    },
    glz_s: {
      min: 0.2,
      max: 0.4
    },
    sum_point: {
      min: 25,
      max: 27
    },
    win_point: {
      min: 18,
      max: 22
    }
  }), _defineProperty(_reactive, "htRange", {
    "北京": ["2019-11-15", "2020-3-15"],
    "青岛": ["2019-11-15", "2020-4-5"],
    "临沂": ["2019-11-10", "2020-3-20"],
    "徐州": ["2019-11-15", "2020-3-15"],
    "武汉": ["2019-11-15", "2020-3-15"],
    "长沙": ["2019-11-15", "2020-3-15"],
    "南京": ["2019-11-15", "2020-3-15"],
    "上海": ["2019-11-15", "2020-2-15"],
    "深圳": ["2019-11-15", "2020-2-15"]
  }), _defineProperty(_reactive, "clRange", {
    "北京": ["2019-6-15", "2020-9-15"],
    "青岛": ["2019-6-15", "2020-9-15"],
    "临沂": ["2019-6-15", "2020-9-15"],
    "徐州": ["2019-6-15", "2020-9-15"],
    "武汉": ["2019-6-15", "2020-9-15"],
    "长沙": ["2019-6-15", "2020-9-15"],
    "南京": ["2019-6-15", "2020-9-15"],
    "上海": ["2019-6-15", "2020-9-30"],
    "深圳": ["2019-6-15", "2020-9-30"]
  }), _defineProperty(_reactive, "RecomParams", {
    "青岛": {
      "住宅建筑": {
        area: "",
        glz_n: "0.3",
        glz_ew: "0.2",
        glz_s: "0.4",
        AC: "0.1",
        uw: "0.5",
        uf: "1.2",
        shgc: "0.6",
        sum_point: "25",
        win_point: "18"
      }
    },
    "临沂": {
      "住宅建筑": {
        area: "",
        glz_n: "0.3",
        glz_ew: "0.2",
        glz_s: "0.5",
        AC: "0.5",
        uw: "0.5",
        uf: "1.2",
        shgc: "0.6",
        sum_point: "25",
        win_point: "20"
      }
    },
    "北京": {
      "住宅建筑": {
        area: "",
        glz_n: "0.3",
        glz_ew: "0.35",
        glz_s: "0.5",
        AC: "0.1",
        uw: "0.5",
        uf: "1.6",
        shgc: "0.6",
        sum_point: "25",
        win_point: "18"
      }
    }
  }), _reactive));

  var bindRegion = function bindRegion(city) {
    var region = "";
    ParamsData.coldRegion.forEach(function (item) {
      if (item === city) {
        region = "coldRegion";
      }
    });
    ParamsData.shwcRegion.forEach(function (item) {
      if (item === city) {
        region = "shwcRegion";
      }
    });
    return region;
  };

  var validateParam = function validateParam(region, key, value) {
    var message = "";

    if (key === "area" && value < 0 && value) {
      message = "请输入大于0的数";
    } else {
      var regionData = "".concat(region, "Data");
      var regionOptions = ParamsData[regionData];

      for (var param in regionOptions) {
        if (param === key) {
          var minVal = regionOptions[param].min;
          var maxVal = regionOptions[param].max;

          if (!(value <= maxVal && value >= minVal)) {
            message = "\u8BF7\u8F93\u5165".concat(minVal, "-").concat(maxVal, "\u4E4B\u95F4\u7684\u503C");
          }
        }
      }
    }

    return message;
  };

  var validateSubmit = function validateSubmit(data) {
    if (!data.city) {
      _elementUi.Message.error("请选择城市");

      return false;
    }

    if (!data.htdateRange) {
      _elementUi.Message.error("请输入供暖日期");

      return false;
    }

    if (!data.cldateRange) {
      _elementUi.Message.error("请输入制冷日期");

      return false;
    }

    var buildsInfo = data.editableTabs;

    for (var buildindex in buildsInfo) {
      var buildname = buildsInfo[buildindex].title;

      if (buildsInfo[buildindex].buildtype === "") {
        _elementUi.Message.error("".concat(buildname, "\u7684\u5EFA\u7B51\u7C7B\u578B\u4E0D\u80FD\u4E3A\u7A7A"));

        return false;
      }

      var buildParams = buildsInfo[buildindex].params;
      var buildWarning = buildsInfo[buildindex].warning;

      for (var param in buildParams) {
        var paramValue = buildParams[param];
        var paramWarning = buildWarning[param];
        var paramlabel = buildsInfo[buildindex].label[param].replace(/[^\u4e00-\u9fa5]/gi, "");

        if (paramValue === "") {
          _elementUi.Message.error("".concat(buildname, "\u7684").concat(paramlabel, "\u4E0D\u80FD\u4E3A\u7A7A"));

          return false;
        }

        if (paramWarning != "") {
          _elementUi.Message.error("\u8BF7\u68C0\u67E5".concat(buildname, "\u7684").concat(paramlabel));

          return false;
        }
      }
    }

    return true;
  };

  var autoSethtRangefun = function autoSethtRangefun(city) {
    var htRange = ParamsData.htRange;

    for (var item in htRange) {
      if (item === city) {
        return htRange[item];
      }
    }
  };

  var autoSetclRangefun = function autoSetclRangefun(city) {
    var clRange = ParamsData.clRange;

    for (var item in clRange) {
      if (item === city) {
        return clRange[item];
      }
    }
  };

  var autoSetRecomParamsfun = function autoSetRecomParamsfun(city, buildtype) {
    var recomlist = new Object();
    var RecomParams = ParamsData.RecomParams;
    Object.keys(RecomParams).forEach(function (item) {
      if (item === city) {
        Object.keys(RecomParams[item]).forEach(function (subitem) {
          if (subitem === buildtype) {
            recomlist = RecomParams[item][subitem];
          }
        });
      }
    });
    return JSON.stringify(recomlist);
  };

  return {
    ParamsData: ParamsData,
    bindRegion: bindRegion,
    validateParam: validateParam,
    validateSubmit: validateSubmit,
    autoSethtRangefun: autoSethtRangefun,
    autoSetclRangefun: autoSetclRangefun,
    autoSetRecomParamsfun: autoSetRecomParamsfun
  };
}