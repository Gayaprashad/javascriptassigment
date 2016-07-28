var lin;
var fs = require('fs'),


// var rd = readline.createInterface({
   input: fs.createReadStream('Indicators.csv'),
//
});

var countryName=["Afghanistan","Armenia","Azerbaijan","Bahrain","Bangladesh","Bhutan","Brunei Darussalam","Cambodia","China","India","Indonesia","Iran, Islamic Rep.","Iraq","Israel","Palestine","Japan","Jordan","Kazakhstan","Kuwait","Lebanon","Malaysia","Maldives","Mongolia","Myanmar","Nepal","Oman","Pakistan","Philippines","Qatar","Russian Federation","Saudi Arabia","Singapore","Sri Lanka","Syrian Arab Republic","Tajikistan","Thailand","Turkey","Turkmenistan","United Arab Emirates","Uzbekistan","Vietnam","Yemen, Rep."];
var i=0,flag=new Array(),delta=1;
for(i=0;i<2015;i++)
{
    flag[i]=0;
}
var arrayobject=[];
var header=[];
var cname="CountryName";
var cname_pos = 0;
var Indname="IndicatorName";
var ind_pos=0;
var year="Year";
var year_pos=0;
var value="Value";
var value_pos=0;
var two010=[];
var obj=[];
rd.on('line', function(line) {
        lin=line;
       temp=lin.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

       if(delta==1)
       {
           header=temp;
            cname_pos=header.indexOf(cname);
        //    console.log(cname_pos);
            ind_pos=header.indexOf(Indname);

            year_pos=header.indexOf(year);

            value_pos=header.indexOf(value);
        //    console.log("value_pos :"+value_pos);
           delta=0;
        //    console.log(temp[cname_pos]);
       }

        if(countryName.indexOf(temp[cname_pos])!=-1)
        {
            // console.log(temp);
            if ((temp[ind_pos]=='"Life expectancy at birth, female (years)"')||( temp[ind_pos]=='"Life expectancy at birth, male (years)"'))
            {
                if(flag[(+(temp[year_pos]))]!=0)
                {
                    for(i=0;i<arrayobject.length;i++)
                    {
                        if(arrayobject[i].year==temp[year_pos])
                        {
                            if(temp[ind_pos]==='"Life expectancy at birth, female (years)"')
                            {
                                arrayobject[i].LE_female = arrayobject[i].LE_female+(+(temp[value_pos]));
                                    // console.log(arrayobject[i].LE_female);
                                        flag[(+(temp[year_pos]))]++;


                            }
                            else if(temp[ind_pos]==='"Life expectancy at birth, male (years)"')
                            {
                                arrayobject[i].LE_male = arrayobject[i].LE_male +(+(temp[value_pos]));
                                    // console.log(arrayobject[i].LE_male);
                                        flag[(+(temp[year_pos]))]++;
                            }
                        }
                    }
                }
                else if((flag[(+(temp[year_pos]))]==0)&& ((temp[year_pos]%5)==0))
                {
                    arrayobject[arrayobject.length] = new Object();
                    arrayobject[arrayobject.length-1].LE_male=0;
                    arrayobject[arrayobject.length-1].LE_female=0;
                    arrayobject[arrayobject.length-1].year=temp[year_pos];

                    if(temp[ind_pos]=='"Life expectancy at birth, female (years)"')
                    {
                        arrayobject[arrayobject.length-1].LE_female+= (+(temp[value_pos]));
                        // console.log((+(arrayobject[arrayobject.length-1].LE_female)));

                    }
                    else if(temp[ind_pos]=='"Life expectancy at birth, male (years)"')
                    {
                        arrayobject[arrayobject.length-1].LE_male+= (+(temp[value_pos]));
                        console.log((+(arrayobject[arrayobject.length-1].LE_male)));

                    }
                    flag[(+(temp[year_pos]))]=1;
                }
            }
        }
        if(temp[year_pos]==2010)
        {
           if(temp[ind_pos]=='"Life expectancy at birth, total (years)"')
           {
             //   console.log(temp[0]);
               var camp=new Object();
               camp.cname=temp[cname_pos];
               camp.LE_total=temp[value_pos];
               two010[two010.length]=camp;
           }
        }
});

rd.on('close', function() {

    for(i=0;i<arrayobject.length;i++){
        flag[arrayobject[i].year]/=2;
        arrayobject[i].LE_male = (arrayobject[i].LE_male /flag[arrayobject[i].year]);
        arrayobject[i].LE_female = (arrayobject[i].LE_female / flag[arrayobject[i].year]);
    }
var random=JSON.stringify(arrayobject);
fs.appendFile('out_new.json',random);

two010.sort(function(a,b){
    return b.LE_total-a.LE_total;
});

for(i=0;i<5;i++)
{
    obj[i]=two010[i];
}
// console.log(obj);
var random=JSON.stringify(obj);
fs.appendFile('out1_new.json',random);
});
