function formatDateTime(date, format) {
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
    a: date.getHours() < 12 ? '上午' : '下午', // 上午/下午
    A: date.getHours() < 12 ? 'AM' : 'PM', // AM/PM
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return format;
}

$(document).ready(function () {
 var calc_history = localStorage.getItem("calc_history")
 if (calc_history) {
  try {
   calc_history = JSON.parse(calc_history)
  } catch (err) {
   calc_history = []
  }
 } else {
  calc_history = []
 }
 $(".help").mouseover(function (ev) {
  $(this).find(".help-msg").show()
 })
 $(".help").mouseout(function (ev) {
  $(this).find(".help-msg").hide()
 })

 function addTicket (val) {
  if ($("#tickets > li").length >= 20) {
   return alert("不能再添加更多数据，否则计算速度将会很慢")
  }
  var li = $(`<li><input type="number" value="${val}"></li>`)
  $("#tickets").append(li)
 }
 $("#add").click(function (ev) {
  addTicket()
 })

 $("#calc").click(function (ev) {
  var values = [], ovalues = []
  var target = +$("#sum").val()
  if (isNaN(target) || target == 0) {
   alert("总数填写错误")
   return
  }
  $("#tickets li input").each(function () {
   var val
   try {
    val = +($(this).val() || 0)
   } catch (err) {
    val = 0
   }
   ovalues.push(val)
   if (val > 0 && val <= target) { // 剔除无效数字，可加快计算速度
    values.push(val)
   }
  })
  if (values.length === 0) {
   return alert("未填写有效数字")
  }
  var mode = $("#mode").val()
  var error_threshold = $("#error_threshold").val()
  try {
   error_threshold = +error_threshold
   if (isNaN(error_threshold)) {
    error_threshold = 0
   }
  } catch (err) {
   error_threshold = 0
  }
  var result = calc(values, target, mode, error_threshold)
  if (result.minArr.length === 0) {
   $("#result").text(`失败，无法计算出求和树`)
  } else {
   $("#result").text(`最终最近总和为：${result.min.toFixed(2)},求和数分别是：${result.minArr.join(",")}`)

  }

  // 保存计算结果
  var history_find = calc_history.find(function (item) {
   return item.ovalues.join(",") === ovalues.join(",") && item.target === target && item.mode === mode && item.error_threshold === error_threshold
  })
  if (!history_find) {
   calc_history.push({
    ovalues,
    target,
    mode,
    error_threshold,
    min: result.min,
    minArr: result.minArr,
    time: formatDateTime(new Date(), 'yyyy-MM-dd hh:mm:ss')
   })
   localStorage.setItem("calc_history", JSON.stringify(calc_history))
  }

 })

 $("#clear").click(function (ev) {
  $("#tickets").children().remove()
  $("#result").text("")
 })

 function textAddInput (ipts) {
  ipts.forEach(item => {
   addTicket(item)
  })
 }


 $("#textAdd").click( function (ev) {
  var rect = $(this)[0].getBoundingClientRect()
  $("#textAddDialog").show()
  $("#textAddDialog .dialog-content").css("top", rect.bottom + 'px')
 })

 $(".dialog .dialog-close").click(function () {
  $(this).parents(".dialog").hide()
 })

 $(".dialog  .dialog-mask").click(function (ev) {
  $(this).parents(".dialog").hide()
 })

 $("#confirmTextAdd").click(function () {
  var text = $("#textAddDialog #textAddText").val()
  $("#tickets").children().remove()
  var ipts = text.split(",").map(item => {
   try {
    return +item
   } catch {
    return NaN
   }
  }).filter(item => !isNaN(item) && item > 0)

  var is_over_20 = false
  if (ipts.length > 20) {
   is_over_20 = true
   ipts.length = 20
  }

  textAddInput(ipts)

  if (is_over_20) {
   return alert("无效数据和第20个有效数据后面的数据不会添加")
  }
  $("#textAddDialog #textAddText").val("")
  $(this).parents(".dialog").hide()
 })




 function getModeText(mode_val) {
    // <option value="closest">大于小于均可</option>
    // <option value="greater">大于目标值</option>
    // <option value="less">小于目标值</option>
    if(mode_val === 'closest') return '大小于均可'
    if(mode_val === 'greater') return '大于目标值'
    if(mode_val === 'less') return '小于目标值'
    return ''
 }

 $("#history").click(function (ev) {
  var rect = $(this)[0].getBoundingClientRect()

 var window_width =  $(window).width()
  $("#historyDialog").show()
  if(window_width > 500 ) {
    $("#historyDialog .dialog-content").css("top", rect.bottom + 12 + 'px')
    $("#historyDialog .dialog-content").css("left", rect.left + rect.width / 2 + 'px')
    $("#historyDialog .dialog-content").css("transform", 'translateX(-50%)')
  } else {
    $("#historyDialog .dialog-content").css("left", "0")
    $("#historyDialog .dialog-content").css("border-radius", "12px 12px 0 0")
    $("#historyDialog .dialog-content").css("bottom", 0)
  }
  $("#historyDialog .dialog-content").css("width", '100%')

  var calc_history_clone = JSON.parse(JSON.stringify(calc_history))
  calc_history_clone.reverse()
  console.log(calc_history_clone)
  $("#historyTable").children().remove()
  if(calc_history_clone.length > 0) {
   calc_history_clone.forEach((item, index) => {
    
    var $tr = $(`<div id="historyItem_${index}" class="history-item mt-12">
    <div><span class="font-bold">时间：</span>${item.time}</div>
    <div>
    <div><span class="font-bold">数据：</span>${item.ovalues.join(",")}</div>
    </div>

   <div class="flex-align-center gutter-12 mt-7">
   <div class="flex-1"> <div class="t-center font-bold">目标值</div> <div class="t-center">${item.target}</div></div>
   <div class="flex-1">  <div class="t-center font-bold">模式</div><div class="t-center">${getModeText(item.mode)}</div></div>
   <div class="flex-1"> <div class="t-center font-bold">误差阈值</div><div class="t-center">${item.error_threshold}</div></div>
   </div>
   <div class="flex-align-center gutter-12 mt-7">
    <div> <div class="t-center font-bold">计算结果</div><div class="t-center">${item.min}</div></div>
    <div class="flex-1"> <div class="t-center font-bold">参数计算的数据</div><div class="t-center">${item.minArr.join(",")}</div></div>
   </div>
 
   <div class="btns flex-between">
   <button  type="button" class="btn btn-primary import_item " >编辑</button>
   <button  type="button" class="btn btn-primary delete_item" >删除</button>
 </div>
    </div>`)

    // console.log($tr.find(".btns .import_item"))
    $tr.find(".btns .import_item").click(function(ev) {
  $("#tickets").children().remove()
      textAddInput(item.ovalues)
      $("#sum").val(item.target)
      $("#mode").val(item.mode)
      $("#error_threshold").val(item.error_threshold)
      $(this).parents(".dialog").hide()
    })

    $tr.find(".btns .delete_item").click(function(ev) {
      $(this).parents(".history-item").remove()
      calc_history.splice(index, 1)
      localStorage.setItem("calc_history", JSON.stringify(calc_history))
    })
 
   
    $("#historyTable").append($tr)
   })
  } else {
   $("#historyTable").append("<div>暂无历史记录</div>")
  }
  


 })

})