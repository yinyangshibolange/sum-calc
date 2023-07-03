(function () {
 function calc (nums, target) {
  var _nums_len = nums.length
  var len = Math.pow(2, _nums_len)

  function strToLen (str, len) {
   var _len = str.length
   if (_len < len) {
    return '0'.repeat(len - _len) + str
   } else {
    return str.slice(0, len)
   }
  }

  var minArr = []
  var min = target * 10
  for (let i = 0; i < len; i++) {
   var _num = strToLen(i.toString(2), _nums_len)

   let sum = 0, _tempArr = []
   _num.split('').forEach((item, index) => {
    if (item === '1') {
     sum += nums[index]
     _tempArr = [..._tempArr, nums[index]]
    }
   })
   if (sum > target && sum < min) {
    min = sum
    minArr = _tempArr
   }
  }


  return {
   min,
   minArr,
  }
 }

 window.calc = calc
})()

