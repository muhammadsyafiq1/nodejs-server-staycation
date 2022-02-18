const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Member = require('../models/Member');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const User = require('../models/User');
const Item = require('../models/Item');
const Booking = require('../models/Booking');
const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');

module.exports = {

    viewSignin: async (req, res) => {
        try {
          const alertMessage = req.flash('alertMessage');
          const alertStatus = req.flash('alertStatus');
          const alert = { message: alertMessage, status: alertStatus };
          if (req.session.user == null || req.session.user == undefined) {
            res.render('index', {
              alert,
              title: "Staycation | Login"
            });
          } else {
            res.redirect('/admin/dashboard');
          }
        } catch (error) {
          res.redirect('/admin/signin');
        }
      },

    actionSignin: async (req, res) => {
        try {
          const { name, password } = req.body;
          const user = await User.findOne({ name: name });
          if (!user) {
            req.flash('alertMessage', 'User yang anda masukan tidak ada!!');
            req.flash('alertStatus', 'danger');
            return res.redirect('/admin/signin');
          }
          const isPasswordMatch = await bcrypt.compare(password, user.password);
          if (!isPasswordMatch) {
            req.flash('alertMessage', 'Password yang anda masukan tidak cocok!!');
            req.flash('alertStatus', 'danger');
            return res.redirect('/admin/signin');
          }

          req.session.user = {
              id: user.id,
              name: user.name
          }

            res.redirect('/admin/dashboard');
    
        } catch (error) {
            return res.redirect('/admin/signin');
        }
    },

    actionLogout: (req, res) => {
        req.session.destroy();
        res.redirect('/admin/signin');
      },

    // return view dashboard 
    viewDashboard: (req, res) => {
        try{
            res.render('admin/dashboard/view_dashboard', {
                title: "Staycation | Dashboard",
                user: req.session.user
            });
        }catch(error){
            res.redirect('/admin/dashboard');
        }
    },

    viewCategory: async (req, res) => {
        try{
            // ambil semua category dengan method find
            const categories = await Category.find();
            // deklarasikan flash message
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message: alertMessage, status: alertStatus};
            
            // return view
            res.render('admin/dashboard/category/view_category', {
                categories,
                user: req.session.user,
                alert,
                title: "Staycation | Category"
            });
        // jika error
        }catch(error) {
            res.redirect('/admin/category');
        }
    },

    addCategory: async (req, res) => {
        try{
            // ambil value dari request
            const {name} = req.body;
            // masukan ke database
            await Category.create({name});
            // deklarasi flash
            req.flash('alertMessage','Success Add Category');
            req.flash('alertStatus','success');
            res.redirect('/admin/category');
        }catch(error) {
            // jika error deklarasikan flash error
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus','danger');
            res.redirect('/admin/category');
        }
    },

    editCategory: async (req, res) => {
        try{
            // ambil value dari req body
            const {id, name} = req.body;
            // ambil category berdasarkan id
            const category = await Category.findOne({_id: id});
            // edit name category
            category.name = name;
            // simpan category
            await category.save();
            // deklarasi flash
            req.flash('alertMessage','Success Update Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        }catch(error){
            // deklarasi flash jika error
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus','danger');
            res.redirect('/admin/category');
        }
    },

    deleteCategory: async (req, res) => {
        try{
            const {id} = req.params;
            const category = await Category.findOne({_id: id});
            await category.remove();
            req.flash('alertMessage','Success delete category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus','danger');
            res.redirect('/admin/category');
        }
    },

    viewBank: async (req, res) => {
       try{
            const banks = await Bank.find(); 
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message: alertMessage, status: alertStatus};
            res.render('admin/dashboard/bank/view_bank', {
                alert,
                title: "Staycation | Bank",
                banks,
                user: req.session.user
            });
       }catch(error){
            res.redirect('/admin/bank')
       }
    },

    addBank: async (req, res) => {
        try{
            const {name, nameBank, nomorRekening} = req.body;
            await Bank.create({
                name, 
                nameBank, 
                nomorRekening,
                imageUrl: `images/${req.file.filename}`
            });
            req.flash('alertMessage','Success Add Bank');
            req.flash('alertStatus','success');
            res.redirect('/admin/bank')
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus','danger');
            res.redirect('/admin/bank');
        }
    },

    editBank: async (req, res) => {
        try{
            const { id, name, nameBank, nomorRekening } = req.body;
            const bank = await Bank.findOne({_id: id});
            if(req.file == undefined) {
                bank.name = name;
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                await bank.save();
                req.flash('alertMessage','Success update bank');
                req.flash('alertStatus','success');
                res.redirect('/admin/bank');
            } else {
                await fs.unlink(path.join(`public/images/${bank.imageUrl}`));
                bank.name = name;
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                bank.imageUrl = `images/${req.file.filename}`;
                await bank.save();
                req.flash('alertMessage','Success update bank');
                req.flash('alertStatus','success');
                res.redirect('/admin/bank');
            }
        }catch(error){
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus',' danger');
            res.redirect('/admin/bank');
        }
    },

    deleteBank : async (req, res) => {
        try{
            const {id} = req.params;
            const bank = await Bank.findOne({_id: id});
            await fs.unlink(path.join(`public/images/${bank.imageUrl}`));
            await bank.remove();
            req.flash('alertMessage','Success delete bank');
            req.flash('alertStatus','success');
            res.redirect('/admin/bank');
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus','danger');
            res.redirect('/admin/bank');
        }
    },

    // items
   viewItem: async (req, res) => {
      try{
        const items = await Item.find()
        .populate({ path: 'imageId', select: 'id imageUrl' })
        .populate({ path: 'categoryId', select: 'id name' });
        const categories = await Category.find();
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = {message: alertMessage, status: alertStatus};
        res.render('admin/dashboard/item/view_item', {
            title: "Staycation | item",
            categories,
            alert,
            items,
            user: req.session.user,
            action : 'view',
        });
      }catch(error){
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus','danger');
        res.redirect('/admin/item');
      }
   },

   addItem : async (req, res) => {
        try{
            const {categoryId,price,title,city,description} = req.body;
            if(req.files.length > 0){
                const category = await Category.findOne({ _id : categoryId });
                const newItem = {
                    categoryId: category._id,
                    title,
                    price,
                    city,
                    description,
                }
                const item = await Item.create(newItem);
                category.itemId.push({ _id: item._id });
                await category.save();

                for( let i = 0; i < req.files.length; i++){
                    const imageSave = await Image.create({ imageUrl: `images/${req.files[i].filename}` });
                    item.imageId.push({ _id: imageSave._id });
                    await item.save();
                }

                req.flash('alertMessage','Success add item');
                req.flash('alertStatus','success');
                res.redirect('/admin/item');
            }
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus','danger');
            res.redirect('/admin/item');
        }
   },

   showImageItem : async (req, res) => {
       try {
        const { id } = req.params;
        const item = await Item.findOne({ _id: id })
            .populate({ path: 'imageId', select: 'id imageUrl' });
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = {message: alertMessage, status: alertStatus};
        res.render('admin/dashboard/item/view_item', {
            title: "Staycation | Show Image Item",
            alert,
            item,
            user: req.session.user,
            action: 'show image',
        });
       }catch(error){
        req.flash('alertMessage',`${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/item');
       }
   },

   showEditItem : async (req, res) => {
       try {
        const {id} = req.params;
        const item = await Item.findOne({ _id: id })
            .populate({ path: 'imageId', select: 'id imageUrl' })
            .populate({ path: 'categoryId', select: 'id name' });
        console.log(item);
        const categories = await Category.find();
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = {message: alertMessage, status: alertStatus};
        res.render('admin/dashboard/item/view_item', {
            title :'Staycation | edit item',
            alert,
            categories,
            item,
            action : 'edit',
            user: req.session.user
        });
       }catch(error) {
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/item');
       }
   },

   editItem : async (req, res) => {
       try{
            const {id} = req.params;
            const {categoryId, title, price, city, description} = req.body;
            const item = await Item.findOne({_id: id})
                .populate({path: 'imageId', select: 'id imageUrl'})
                .populate({path: 'categoryId', select: 'id name'});
            if(req.files.length > 0){
                for(let i = 0; i < item.imageId.length; i++){
                    const imageUpdate = await Image.findOne({_id: item.imageId[i]._id});
                    await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
                    imageUpdate.imageUrl = `images/${req.files[i].filename}`;
                    await imageUpdate.save();
                }
                item.title = title;
                item.price = price;
                item.city = city;
                item.categoryId = categoryId;
                item.description = description;
                await item.save();
                req.flash('alertMessage','Success update item');
                req.flash('alertStatus','success');
                res.redirect('/admin/item');
            }else{
                item.title = title;
                item.price = price;
                item.city = city;
                item.categoryId = categoryId;
                item.description = description;
                await item.save();
                req.flash('alertMessage','Success update item');
                req.flash('alertStatus','success');
                res.redirect('/admin/item');
            }
       }catch(error){
            req.flash('alertMessage',`${error.message}`);
            req.flash('alertStatus','danger');
            res.redirect('/admin/item');
       }
   },

   deleteItem : async (req, res) => {
       try{
        const {id} = req.params;
        const item = await Item.findOne({_id: id}).populate('imageId');
        for (let i = 0; i < item.imageId.length; i++){
            Image.findOne({_id: item.imageId[i]._id}).then((image) => {
                fs.unlink(path.join(`public/${image.imageUrl}`));
                image.remove();
            }).catch((error) => {
                req.flash('alertMessage',`${error.message}`);
                req.flash('alertStatus','danger');
                res.redirect('/admin/item');
            });
        }
        await item.remove();
        req.flash('alertMessage','Success delete item');
        req.flash('alertStatus','success');
        res.redirect('/admin/item');
       }catch(error){
        req.flash('alertMessage',`${error.message}`);
        req.flash('alertStatus','danger');
        res.redirect('/admin/item');
       }
   },

   viewDetailItem : async (req, res) => {
        const { itemId } = req.params;
        try{
        // feature dan activity berdsarkan item id
        const features = await Feature.find({itemId : itemId});
        const activities = await Activity.find({ itemd : itemId});
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = {message: alertMessage, status: alertStatus};
        res.render('admin/item/detail-item/view_detail_item',{
            title: 'Staycation | Detail',
            alert,
            itemId,
            features,
            activities,
            user: req.session.user
        });
       }catch(error){
        req.flash('alertMessage',`${error.message}`);
        req.flash('alertStatus','danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
       }
   },

   addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;
    try {
      if (!req.file) {
        req.flash('alertMessage', 'Image not found');
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
      }
      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`
      });

      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: feature._id });
      await item.save();
      req.flash('alertMessage', 'Success Add Feature');
      req.flash('alertStatus', 'success');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    } catch (error) {
      req.flash('alertMessage', `${error.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }
  },

  editFeature : async (req, res) => {
      try{
        const {id , name, qty, itemId} = req.body;
        const feature = await Feature.findOne({_id : id});
        if(req.file == undefined) {
            feature.name = name;
            feature.qty = qty
            await feature.save();
            req.flash('alertMessage','Success update feature');
            req.flash('alertStatus','success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } else {
            await fs.unlink(path.join(`public/${feature.imageUrl}`));
            feature.name = name;
            feature.qty = qty
            feature.imageUrl = `images/${req.file.filename}`;
            await feature.save();
            req.flash('alertMessage','Success update feature');
            req.flash('alertStatus','success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
      }catch(error){
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);  
      }
  },

  deleteFeature : async (req, res) => {
    const {id , itemId} = req.params;
    try{
        const feature = await Feature.findOne({ _id: id });

        // ambil itemnya juga karena ingin hapus featuredId dalam collection items
        const item = await Item.findOne({ _id: itemId }).populate('featureId');
        // cek featureId yang akan dihapus
        for(let i = 0; i < item.featureId.length; i++){
            if(item.featureId[i]._id.toString() ===  feature._id.toString()){
                item.featureId.pull({ _id: feature.id });
                await item.save();
            }
        }
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        await feature.remove();
        req.flash('alertMessage','Success delete feature');
        req.flash('alertStatus','success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
    }catch(error){
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect(`/admin/item/show-detail-item/${itemId}`); 
    }
  },

    addActivity : async (req, res) => {
        const {name, type, itemId} = req.body;
        try{
            if(!req.file){
                req.flash('alertMessage', 'Image not found');
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
        // tambah collection activity
        const activity = await Activity.create({
            name,
            type,
            itemId,
            imageUrl: `images/${req.file.filename}`
        });
        // push acticity id ke collection item
        const item  =  await Item.findOne({ _id: itemId });
        item.activityId.push({_id: activity._id});
        await item.save();
        req.flash('alertMessage', 'Success Add Activity');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },

    editActivity : async (req, res) => {
        try{
          const {id , name, type, itemId} = req.body;
          const activity = await Activity.findOne({_id : id});
          if(req.file == undefined) {
              activity.name = name;
              activity.type = type
              await activity.save();
              req.flash('alertMessage','Success update activity');
              req.flash('alertStatus','success');
              res.redirect(`/admin/item/show-detail-item/${itemId}`);
          } else {
              await fs.unlink(path.join(`public/${activity.imageUrl}`));
              activity.name = name;
              activity.type = type
              activity.imageUrl = `images/${req.file.filename}`;
              await activity.save();
              req.flash('alertMessage','Success update activity');
              req.flash('alertStatus','success');
              res.redirect(`/admin/item/show-detail-item/${itemId}`);
          }
        }catch(error){
          req.flash('alertMessage', `${error.message}`);
          req.flash('alertStatus', 'danger');
          res.redirect(`/admin/item/show-detail-item/${itemId}`);  
        }
    },


    deleteActivity : async (req, res) => {
        const {id , itemId} = req.params;
        try{
            const activity = await Activity.findOne({ _id: id });
    
            // ambil itemnya juga karena ingin hapus activitydId dalam collection items
            const item = await Item.findOne({ _id: itemId }).populate('activityId');
            // cek activityId yang akan dihapus
            for(let i = 0; i < item.activityId.length; i++){
                if(item.activityId[i]._id.toString() ===  activity._id.toString()){
                    item.activityId.pull({ _id: activity.id });
                    await item.save();
                }
            }
            await fs.unlink(path.join(`public/${activity.imageUrl}`));
            await activity.remove();
            req.flash('alertMessage','Success delete activity');
            req.flash('alertStatus','success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }catch(error){
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`); 
        }
      },


   viewBooking: async (req, res) => {
       try{
        const bookings = await Booking.find()
            .populate('memberId')
            .populate('bankId');
            console.log(bookings);
        res.render('admin/dashboard/booking/view_booking', {
            title: "Staycation | booking",
            user: req.session.user,
            bookings
        });
       }catch(error){
        req.flash('alertMessage', `${error.message}`);
        req.flash('alertStatus', 'danger');
        res.redirect('/admin/dashboard/booking');
       }
       
   },

   showDetailBooking : async(req, res) => {
       const {id} = req.params;
       try{
        const alertMessage = req.flash('alertMessage');
        const alertStatus = req.flash('alertStatus');
        const alert = {message: alertMessage, status: alertStatus};
        const booking = await Booking.findOne({_id: id})
            .populate('memberId')
            .populate('bankId');
        res.render('admin/dashboard/booking/show_detail_booking', {
            title: "Staycation | Detail",
            user: req.session.user,
            booking,
            alert
        });
       }catch(error){
        res.redirect('/admin/dashboard/booking')
       }
   },

   actionConfirmation : async(req, res) => {
       const {id} = req.params;
       try{
        const booking = await Booking.findOne({_id: id});
        booking.payments.status = 'Accept';
        await booking.save();
        req.flash('alertMessage', 'sukses konfirmasi');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/booking/${id}`);
       }catch(error){
        res.redirect(`/admin/booking/${id}`);
       }
   },

   actionReject : async(req, res) => {
        const {id} = req.params;
        try{
        const booking = await Booking.findOne({_id: id});
        booking.payments.status = 'Reject';
        await booking.save();
        req.flash('alertMessage', 'gagal konfirmasi');
        req.flash('alertStatus', 'success');
        res.redirect(`/admin/booking/${id}`);
        }catch(error){
        res.redirect(`/admin/booking/${id}`);
        }
    },
}