const express = require('express');
const asyncHandler = require('express-async-handler');

const Taxpayer = require('../models/taxpayerModel');
const insuranceReport=require('../models/insuranceReportModel');

const router = express.Router();

const calculateInsurance = (vehicleType, cc) => {
    let vechile_Type=vehicleType;
    let engineCC=cc;
    let insuranceAmount=0;
    

    if(vechile_Type==="Bike"){      
        if(engineCC<=125){
            return (insuranceAmount=1200);
        }
        if(engineCC<=160){
            return (insuranceAmount=1400);
        }
        if(engineCC>=161 && engineCC<=250){
            return (insuranceAmount=1500)
        }
        if(engineCC>=251 && engineCC<=400){
            return (insuranceAmount=1700);
        }
        if(engineCC>=401 && engineCC<=650){
            return (insuranceAmount=2200);
        }
        else{
            return (insuranceAmount=2600);
        }
    }

    if(vechile_Type==="Car"){
         //for car
        if(engineCC<=1000){
            return (insuranceAmount=7000);
        }
        if(engineCC<=1500){
            return (insuranceAmount=9000);
        }
        if(engineCC>=1501 && engineCC<=2000){
            return (insuranceAmount=12000);
        }
        if(engineCC>=2001 && engineCC<=2500){
            return (insuranceAmount=14000);
        }
        if(engineCC>=2501 && engineCC<=2900){
            return (insuranceAmount=16000);
        }
        else{
            return (insuranceAmount=19000);
        }
    }
  
}

const fetchVehicleDetailsForInsurance = asyncHandler(async (req, res) => {
  const {
    bluebook_number,
    vehicle_number,
    engine_cc,
    insurance_company,
    bluebook_file_path,
    citizenship_file_path,
  } = req.body;

  const fetchVehicleData = await Taxpayer.find(
    {
      $and: [
        { bluebook_number: bluebook_number },
        { vehicle_number: vehicle_number },
        { engine_cc: engine_cc },
       
      ],
    },
    function (err, result) {
      if (!err) return result;
    }
  );


  if (fetchVehicleData[0] != undefined) {
    const type = `${fetchVehicleData[0].type}`;
    const cc = `${fetchVehicleData[0].engine_cc}`;
    const taxpayer_name = `${fetchVehicleData[0].taxpayer_name}`;

    const insuranceAmount = calculateInsurance(type, cc);

    console.log("insurance amount is:"+insuranceAmount);


    // calculate expire date
   function calculateInsuranceExpireDate(){
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var insuranceExp = new Date(year + 1, month, day);
    return insuranceExp
   }
   let insuranceExpiryDate= calculateInsuranceExpireDate()

    const  insuranceReports= new insuranceReport({
      bluebook_number: bluebook_number,
      insuranceAmount: insuranceAmount,
      vehicle_number:vehicle_number ,
      engine_cc:engine_cc,
      insurance_type:"Third party",
      taxpayer_name:taxpayer_name,
      type:type,
      insuranceExpiryDate:insuranceExpiryDate,
      insurance_company:insurance_company,
      driver:"500000",
      conductor:"500000",
      helper:"500000",
      passenger:"500000",
      medical_expenses:"300000"

      



    });
    const recordInserted = await insuranceReports.save();
    const policy_number=recordInserted._id

    res.status(200).send({
      success: true,
      insuranceReports
      
    });
  } else {
    res.status(404).send({
      success: false
        });
  }
});

router.route('/').post(fetchVehicleDetailsForInsurance);

module.exports = router;