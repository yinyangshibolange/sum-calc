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
 $("#add").click(function (ev) {
  var li = $('<li><input type="number" value="1"></li>')
  $("#tickets").append(li)
 })

 $("#calc").click(function (ev) {
  var values = []
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
   values.push(val)
  })
  var result = calc(values, target)
  $("#result").text(`最终最近总和为：${result.min},求和数分别是：${result.minArr.join(",")}`)

  // 保存计算结果
  var history_find = calc_history.find(function (item) {
   return item.values.join(",") === values.join(",") && item.target === target
  })
  if (!history_find) {
   calc_history.push({
    values,
    target,
    min: result.min,
    minArr: result.minArr
   })
   localStorage.setItem("calc_history", JSON.stringify(calc_history))
  }

 })
 
})