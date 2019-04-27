export default function (d, stats){
  var breakpointsArr = stats.breakpoints;
  var colorArray;
  if (stats.statType === "ChickenIncreasePercent"){
    colorArray = ['#053061','#2166ac','#4393c3','#92c5de','#ffffff','#f4a582', '#d6604d'];
  } else { 
    colorArray = ['#053061','#2166ac','#4393c3','#92c5de','#B3D6E8','#DEEEF5', '#ffffff'];
  }
  return d >= breakpointsArr[0]  ? colorArray[0]  :
    d >= breakpointsArr[1]  ? colorArray[1]  :
      d >= breakpointsArr[2]  ? colorArray[2]  :
        d >= breakpointsArr[3]  ? colorArray[3]  :
          d >= breakpointsArr[4]  ? colorArray[4]  :
            d >= breakpointsArr[5]  ? colorArray[5]  :
              colorArray[6]  ;
}





