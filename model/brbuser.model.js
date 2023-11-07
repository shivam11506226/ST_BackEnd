const mongoose = require("mongoose");
const userType = require("../enums/userType");
const { activeStatus } = require("../common/const");
const approveStatus = require("../enums/approveStatus");
const mongoosePaginate = require('mongoose-paginate-v2');
const Userb2bSchema = 
  new mongoose.Schema(
    {
      personal_details: {
        first_name: {
          type: String,
          required: true,
        },
        last_name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
          unique: true,
        },
        mobile: {
          country_code: {
            type: String,
            default: "+91",
          },
          mobile_number: {
            type: String,
            required: true,
            unique: true,
          },
        },
        address_details: {
          residential_address: {
            type: String,
            required: true,
          },
          address_2: {
            type: String,
          },
          telephone_number: {
            type: String,
          },
          pincode: {
            type: String,
            required: true,
          },
          country: {
            type: String,
            default: "INDIA",
          },
          state: {
            type: String,
            required: true,
          },
          city: {
            type: String,
            required: true,
          },
        },
        password: { type: String },
      },
      agency_details: {
        agency_name: {
          type: String,
          required: true,
        },
        pan_number: {
          type: String,
          required: true,
          unique: true,
        },
        agency_mobile: {
          country_code: {
            type: String,
            default: "+91",
          },
          mobile_number: {
            type: String,
            required: true,
          },
        },
        address: {
          type: String,
          required: true,
        },
        address_2: {
          type: String,
        },
        fax: {
          type: String,
        },
        pincode: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          default: "INDIA",
        },
        state: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        business_type: {
          type: String,
          required: true,
        },
        office_space: {
          type: String,
        },
        IATA_registration_id: {
          type: String,
        },
        IATA_code: {
          type: String,
        },
        TDS: {
          type: String,
        },
        TDS_percentage: {
          type: String,
        },
        references: {
          type: String,
        },
        consolidators: {
          type: String,
        },
        remarks: {
          type: String,
        },
        document_details: {
          pan_card_document: {
            type: String,
          },
        },
      },
      agency_gst_details: {
        agency_name: {
          type: String,
          required: true,
        },
        agency_classification: {
          type: String,
          required: true,
        },
        agency_GSTIN: {
          type: String,
        },
        state: {
          type: String,
          required: true,
        },
        state_code: {
          type: String,
          required: true,
        },
        provisional_GSTIN: {
          type: String,
        },
        contact_person: {
          type: String,
        },
        phone_number: {
          type: String,
        },
        telephone_number: {
          type: String,
        },
        email: {
          type: String,
        },
        correspondance_mail_id: {
          type: String,
        },
        GST_registration_status: {
          type: String,
        },
        HSN_SAC_code: {
          type: String,
        },
        composition_levy: {
          type: String,
        },
        address_line1: {
          type: String,
          required: true,
        },
        address_line2: {
          type: String,
        },
        pincode: {
          type: String,
          required: true,
        },
        agency_city: {
          type: String,
          required: true,
        },
        supply_type: {
          type: String,
        },
      },
       markup:{
        bus:{
          type: Number,
          default: 0,
         },
         hotel:{
          type: Number,
          default: 0,
         },
         flight:{
          type: Number,
          default: 0,
         },
         holiday:{
          type: Number,
          default: 0,
         },
       },
      walletid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wallet",
      },
      balance: {
        type: Number,
        required: true,
        default: 0,
      },
      is_active: {
        type: Number,
        default: activeStatus.IN_ACTIVE,
      },
      userType: {
        type: String,
        enum: [userType.ADMIN, userType.AGENT, userType.USER, userType.SUBADMIN],
        default: userType.AGENT
      },
      reason: {
        type: String,
        default: "",
      },
    isApproved: {
      type: Boolean,
      default: false
    },
    approveStatus: {
      type: String,
      enum: [approveStatus.APPROVED, approveStatus.PENDING, approveStatus.REJECT],
      default: approveStatus.PENDING
    },
    },
    {
      timestamps: true,
    }
  )
  Userb2bSchema.plugin(mongoosePaginate);
const Userb2b= mongoose.model('Userb2b',Userb2bSchema);

module.exports = Userb2b;
