export default function getColor(d, stats){
    // var breakpointsArr = [400,200,50,10,-11,-25];
    var breakpointsArr = stats.breakpoints;
    // console.log(d);
    // console.log("stats breakpoints= " + stats.breakpoints);
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
    //  return d >= 400  ? '#053061' :
    //         d >= 200  ? '#2166ac' :
    //         d >= 50   ? '#4393c3' :
    //         d >= 10   ? '#92c5de' :
    //         d >= -11  ? '#ffffff' :
    //         d >= -25  ? '#f4a582' :
    //                     '#d6604d';
    // } 
    //else if (stats.statType=== "Höns_2016_1"){
    //  return d >= 400  ? '#053061' :
    //         d >= 200  ? '#2166ac' :
    //         d >= 50   ? '#4393c3' :
    //         d >= 10   ? '#92c5de' :
    //         d >= -11  ? '#ffffff' :
    //         d >= -25  ? '#f4a582' :
    //                     '#d6604d';
    // } 
    


    // treeType = treeType.toLowerCase();
    // return treeType == "Annat".toLowerCase() ? "black" : 
    //     treeType == "Obestämd".toLowerCase() ? "black" : 
    //     treeType == "Okänt".toLowerCase() ? "black" : 
    //     treeType == "Övrig, anges under kommentar".toLowerCase() ? "black" : 
    //     treeType == "Övrigt".toLowerCase() ? "black" : 

    //     treeType == "Al".toLowerCase() ? "green" : 
    //     treeType == "Gråal".toLowerCase() ? "green" : 
    //     // Alm
    //     treeType == "Alm".toLowerCase() ? "green" : 
    //     treeType == "Alm-släktet".toLowerCase() ? "green" : 
    //     treeType == "Skogsalm".toLowerCase() ? "green" : 
    //     treeType == "Lundalm".toLowerCase() ? "green" : 
    //     // Apel
    //     treeType == "Apel".toLowerCase() ? "pink" : 
    //     treeType == "Apel, äpple".toLowerCase() ? "pink" : 
    //     treeType == "Apel-släktet".toLowerCase() ? "pink" : 
    //     treeType == "Vildapel".toLowerCase() ? "pink" : 
    //     treeType == "Äpple".toLowerCase() ? "pink" : 

    //     treeType == "Ask".toLowerCase() ? "green" : 
    //     treeType == "Asp".toLowerCase() ? "green" : 
    //     treeType == "Avenbok".toLowerCase() ? "green" : 
    //     // Poppel (Poplar)
    //     treeType == "Balsampoppel".toLowerCase() ? "brown" : 
    //     treeType == "Gråpoppel".toLowerCase() ? "brown" : 
    //     treeType == "Poppel".toLowerCase() ? "brown" : 
    //     treeType == "Poppel (utom asp)".toLowerCase() ? "brown" : 
    //     treeType == "Pyramidpoppel".toLowerCase() ? "brown" :
    //     treeType == "Populus sp".toLowerCase() ? "brown" : 
    //     //Ek
    //     treeType == "Bergek".toLowerCase() ? "brown" : 
    //     treeType == "Ek".toLowerCase() ? "brown" : 
    //     treeType == "Ek-släktet".toLowerCase() ? "brown" : 
    //     treeType == "Skogsek".toLowerCase() ? "brown" : 
    //     //Björk
    //     treeType == "Björk".toLowerCase() ? "grey" : 
    //     treeType == "Björk-släktet".toLowerCase() ? "grey" :
    //     treeType == "Glasbjörk".toLowerCase() ? "grey" : 
    //     // Bok 
    //     treeType == "Blodbok".toLowerCase() ? "green" : 
    //     treeType == "Bok".toLowerCase() ? "green" : 
    //     // Lönn
    //     treeType == "Blodlönn".toLowerCase() ? "green" : 
    //     treeType == "Lönn".toLowerCase() ? "green" : 
    //     treeType == "Tysklönn".toLowerCase() ? "green" : 

    //     treeType == "En".toLowerCase() ? "green" : 
    //     treeType == "Fågelbär".toLowerCase() ? "green" : 
    //     treeType == "Gran".toLowerCase() ? "green" : 

    //     // Hagtorn
    //     treeType == "Hagtornsläktet".toLowerCase() ? "green" : 
    //     treeType == "Trubbhagtorn".toLowerCase() ? "green" : 

    //     treeType == "Hassel".toLowerCase() ? "green" : 
    //     treeType == "Hägg".toLowerCase() ? "green" : 
    //     treeType == "Hästkastanj".toLowerCase() ? "green" : 
    //     treeType == "Idegran".toLowerCase() ? "green" : 
    //     treeType == "Jolster".toLowerCase() ? "green" : 
    //     treeType == "Kastanj".toLowerCase() ? "green" : 
    //     treeType == "Klibbal".toLowerCase() ? "green" : 
    //     treeType == "Knäckepil".toLowerCase() ? "green" : 
    //     treeType == "Kungsen".toLowerCase() ? "green" : 
    //     treeType == "Körsbär".toLowerCase() ? "green" : 
    //     //Lind
    //     treeType == "Lind".toLowerCase() ? "green" : 
    //     treeType == "Lind-släktet".toLowerCase() ? "green" : 
    //     treeType == "Skogslind".toLowerCase() ? "green" : 
    //     treeType == "Parklind".toLowerCase() ? "green" : 
    //     treeType == "Bohuslind".toLowerCase() ? "green" : 

    //     //Lärk
    //     treeType == "Lärk".toLowerCase() ? "green" : 
    //     treeType == "Lärk, europeisk".toLowerCase() ? "green" : 

    //     treeType == "Malus sp".toLowerCase() ? "green" : 
    //     treeType == "Masurbjörk".toLowerCase() ? "green" : 
    //     treeType == "Oxel".toLowerCase() ? "green" : 
    //     //Pil
    //     treeType == "Pil".toLowerCase() ? "green" : 
    //     treeType == "Pil (flera arter)".toLowerCase() ? "green" : 
    //     treeType == "Vitpil".toLowerCase() ? "green" : 
        
    //     treeType == "Päron".toLowerCase() ? "green" : 
    //     treeType == "Rönn".toLowerCase() ? "green" : 
    //     //Salix
    //     treeType == "Salix".toLowerCase() ? "green" : 
    //     treeType == "Salix (viden m.fl.)".toLowerCase() ? "green" : 
    //     treeType == "Salix sp".toLowerCase() ? "green" : 

    //     treeType == "Sälg".toLowerCase() ? "green" : 
    //     treeType == "Sötkörsbär / fågelbär".toLowerCase() ? "green" : 
    //     // Tall
    //     treeType == "Tall".toLowerCase() ? "green" : 
    //     treeType == "Svarttall".toLowerCase() ? "green" : 

    //     treeType == "Vide".toLowerCase() ? "green" : 
    //     treeType == "Vårtbjörk".toLowerCase() ? "green" : 
    //     treeType == "Ädelgran".toLowerCase() ? "green" : 
    //                          "purple";
}





