const Category = require('../models/Category');

module.exports = {
    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard', {
            title: "Staycation | Dashboard"
        });
    },

    viewCategory: async (req, res) => {
        try{
            const categories = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {message: alertMessage, status: alertStatus};
            res.render('admin/dashboard/category/view_category', {
                categories,
                alert,
                title: "Staycation | Category"
            });
        }catch(error) {
            res.redirect('/admin/category');
        }
    },

    addCategory: async (req, res) => {
        try{
            const {name} = req.body;
            await Category.create({name});
            req.flash('alertMessage','Success Add Category');
            req.flash('alertStatus','success');
            res.redirect('/admin/category');
        }catch(error) {
            req.flash('alertMessage',`$error.message`);
            req.flash('alertStatus','danger');
            res.redirect('/admin/category');
        }
    },

    editCategory: async (req, res) => {
        try{
            const {id, name} = req.body;
            const category = await Category.findOne({_id: id});
            category.name = name;
            await category.save();
            req.flash('alertMessage','Success Update Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        }catch(error){
            req.flash('alertMessage', `$error.message`);
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
            req.flkash('alertStatus', 'success');
            res.redirect('/admin/category');
        }catch(error){
            req.flash('alertStatus','danger');
            res.redirect('/admin/category');
        }
    },

    viewBank: (req, res) => {
        res.render('admin/dashboard/bank/view_bank', {
            title: "Staycation | bank"
        });
    },

   viewItem: (req, res) => {
       res.render('admin/dashboard/item/view_item', {
           title: "Staycation | item"
       });
   },

   viewBooking: (req, res) => {
       res.render('admin/dashboard/booking/view_booking', {
           title: "Staycation | booking"
       });
   }
}