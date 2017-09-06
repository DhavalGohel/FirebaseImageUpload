import { Component, ViewChild} from '@angular/core';
import { NavController, NavParams, Platform, Navbar, Events, ModalController} from 'ionic-angular';
import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';

import { InvoiceService } from '../../../providers/invoice-service/invoice-services';
import { InvoiceSelectModel } from '../../modals/invoice-select/invoice-select'

@Component({
  selector: 'page-invoice-edit',
  templateUrl: 'invoice-edit.html',
})

export class InvoiceEditPage {
  @ViewChild('navbar') navBar: Navbar;

  public apiResult: any;
  public api_token = this.appConfig.mToken;
  public invoiceId: string = null;
  public isCrOrDr: string = 'CR';

  public selectedTab: string = 'part_1';
  public invoiceData: any = {}

  public mClientDD: any = [];
  public mTaxDD: any = [];
  public mGSTtaxDD: any = [];
  public mSimpleTaxDD: any = [];
  public mServiceDD: any = [];
  public mExpanceDD: any = [];

  public mTaxValueData: any = [];

  public mInvoiceDate: any = new Date().toISOString();
  public mOverdueDate: any = null;

  public mServiceData: any = {
    description: '',
    service_id: '',
    amount: '',
  }

  public mExpanceData: any = {
    description: '',
    expance_id: '',
    amount: '',
  }

  public taxId = null;

  public InvoiceSelectModel: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public invoiceService: InvoiceService,
    public eventsCtrl: Events,
    public modalCtrl: ModalController) {
    if (this.navParams.get('item_id') != null) {
      console.log(this.navParams.get('item_id'));
      this.invoiceId = this.navParams.get('item_id');
    }
  }


  ionViewDidEnter() {
    this.platform.ready().then((readySource) => {
      this.platform.registerBackButtonAction(() => {
        this.onChangeTabFromBackButton();
      });

      this.navBar.backButtonClick = () => {
        this.onChangeTabFromBackButton();
      };
    });

    this.eventsCtrl.subscribe("search-select:refresh_value", (data) => {
      this.onSearchSelectChangeValue(data);
    });

    this.eventsCtrl.subscribe("invoice-add:refresh_data", (data) => {
      this.onSelectChangeValue(data);
    });

    this.onLoadGetEditData();
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe("search-select:refresh_value");
    this.eventsCtrl.unsubscribe("invoice-add:refresh_data");
  }

  onChangeTabFromBackButton() {
    if (this.selectedTab == "part_3") {
      this.onClickSetTab("part_2");
    } else if (this.selectedTab == "part_2") {
      this.onClickSetTab("part_1");
    } else if (this.selectedTab == "part_1") {
      this.navCtrl.pop();
    }
  }

  onClickSetTab(tabName) {
    setTimeout(() => {
      this.selectedTab = tabName;
    }, 500);

  }

  onLoadGetEditData() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.invoiceService.getInvoiceDetail(this.api_token, this.invoiceId).then(result => {
        if (result != null) {
          this.appConfig.hideLoading();

          this.apiResult = result;

          if (this.apiResult.success) {
            this.setClientData(this.apiResult);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
            }
          }
        } else {
          this.appConfig.hideLoading();
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      }, error => {
        this.appConfig.hideLoading();
        this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setClientData(data) {
    console.log(data);

    if (data != null) {
      this.invoiceData.reference_number = "";
      this.invoiceData.discount = 0;
      this.invoiceData.total = 0;
      this.invoiceData.total_bill = 0;
      this.invoiceData.total_paid = 0;
      this.invoiceData.total_pending = 0;
      this.invoiceData.current_balance = 0;
      this.invoiceData.mServiceDataList = [];
      this.invoiceData.mExpanceDataList = [];
      this.invoiceData.mRecentExpanceList = [];


      if (data.clientinvoice.user_id != null && data.clientinvoice.user_id != '') {
        this.invoiceData.user_id = data.clientinvoice.user_id;
      }
      if (data.clientinvoice.account_id != null && data.clientinvoice.account_id != '') {
        this.invoiceData.account_id = data.clientinvoice.account_id;
      }

      if (data.clientinvoice.invoicedate != null && data.clientinvoice.invoicedate != '') {
        this.mInvoiceDate = this.appConfig.stringToDateToISO(data.clientinvoice.invoicedate);
      }
      if (data.clientinvoice.invoiceduedate != null && data.clientinvoice.invoiceduedate != '') {
        this.mOverdueDate = this.appConfig.stringToDateToISO(data.clientinvoice.invoiceduedate);
      }

      this.invoiceData.invoice_date = this.appConfig.transformDate(this.mInvoiceDate);
      this.invoiceData.overdue_date = this.appConfig.transformDate(this.mOverdueDate);

      if (data.clientinvoice.invoice_prefix != null && data.clientinvoice.invoice_prefix != "") {
        this.invoiceData.invoice_prefix = data.clientinvoice.invoice_prefix;
      }

      if (data.clientinvoice.invoicenumber != null && data.clientinvoice.invoicenumber != "") {
        this.invoiceData.invoicenumber = data.clientinvoice.invoicenumber;
      }

      if (data.clientinvoice.billingaddress != null && data.clientinvoice.billingaddress != "") {
        this.invoiceData.billingaddress = data.clientinvoice.billingaddress;
      }

      if (data.clientinvoice.remark != null && data.clientinvoice.remark != "") {
        this.invoiceData.remark = data.clientinvoice.remark;
      }

      if (data.clientinvoice.discount != null && data.clientinvoice.discount != '') {
        this.invoiceData.discount = data.clientinvoice.discount;
      }

      if (data.clientinvoice.total != null && data.clientinvoice.total != '') {
        this.invoiceData.total = data.clientinvoice.total;
      }

      if (data.clientinvoice.roundof != null && data.clientinvoice.roundof != '') {
        this.invoiceData.roundof = data.clientinvoice.roundof;
      }

      if (data.clientinvoice.invoice_total != null && data.clientinvoice.invoice_total != '') {
        this.invoiceData.invoice_total = data.clientinvoice.invoice_total;
      }

      if (data.total_invoice != null && Object.keys(data.total_invoice).length > 0) {
        if (data.total_invoice.total_bill != null && data.total_invoice.total_bill != "") {
          this.invoiceData.total_bill = data.total_invoice.total_bill;
        }
        if (data.total_invoice.total_paid != null && data.total_invoice.total_paid != "") {
          this.invoiceData.total_paid = data.total_invoice.total_paid;
        }
        if (data.total_invoice.total_pending != null && data.total_invoice.total_pending != "") {
          this.invoiceData.total_pending = data.total_invoice.total_pending;
        }
        if (data.total_invoice.current_balance != null && data.total_invoice.current_balance != "") {
          this.invoiceData.current_balance = data.total_invoice.current_balance;
          if(parseInt(data.total_invoice.current_balance) < 0){
            this.isCrOrDr = 'DR';
          }
        }
      }

      if (data.clients != null && Object.keys(data.clients).length > 0) {
        this.mClientDD = this.appConfig.getFormattedArray(data.clients);
      }

      if (data.clientinvoice.client_id != null && data.clientinvoice.client_id != "") {
        this.invoiceData.client_id = data.clientinvoice.client_id;
      }

      if (data.gst_tax != null && Object.keys(data.gst_tax).length > 0) {
        this.mGSTtaxDD = this.appConfig.getFormattedArray(data.gst_tax);
      }
      if (data.taxes != null && Object.keys(data.taxes).length > 0) {
        this.mSimpleTaxDD = this.appConfig.getFormattedArray(data.taxes);
      }

      if (data.services != null && Object.keys(data.services).length > 0) {
        this.mServiceDD = this.appConfig.getFormattedArray(data.services);
      }

      if (data.expense_types != null && Object.keys(data.expense_types).length > 0) {
        this.mExpanceDD = this.appConfig.getFormattedArray(data.expense_types);
      }

      if (data.invoice_detail != null && Object.keys(data.invoice_detail).length > 0) {
        this.setClientServiceDataList(data.invoice_detail);
      }

      if (data.invoice_expense_detail != null && Object.keys(data.invoice_expense_detail).length > 0) {
        this.setClientExpanceDataList(data.invoice_expense_detail);
      }

      this.onChangeDateCheck(false);
      if (data.clientinvoice.onzup_tax_master_id != null && data.clientinvoice.onzup_tax_master_id != "") {
        this.invoiceData.onzup_tax_master_id = data.clientinvoice.onzup_tax_master_id;
        this.taxId =data.clientinvoice.onzup_tax_master_id;
        this.onSelectGetTaxData(this.invoiceData.onzup_tax_master_id);
      }
    }
  }

  // when select client from dropdown then this api call
  onSelectGetClientInvoiceData(client_id) {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.invoiceService.getClientInvoiceData(this.api_token, client_id).then(result => {
        if (result != null) {
          this.appConfig.hideLoading();

          this.apiResult = result;

          if (this.apiResult.success) {
            this.setClientInvoiceData(this.apiResult);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
            }
          }
        } else {
          this.appConfig.hideLoading();
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      }, error => {
        this.appConfig.hideLoading();
        this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setClientInvoiceData(data) {
    if (data != null) {
      if (data.total_invoice != null && data.total_invoice != "") {
        this.invoiceData.total_bill = data.total_invoice.total_bill;
        this.invoiceData.total_paid = data.total_invoice.total_paid;
        this.invoiceData.total_pending = data.total_invoice.total_pending;
        this.invoiceData.current_balance = data.total_invoice.current_balance;
      }
      if (data.billing_address != null && data.billing_address != "") {
        this.invoiceData.billingaddress = data.billing_address;
      }
      if (data.services != null && data.services.length > 0) {
        this.setClientServiceDataList(data.services);
      }

      if (data.recent_expenses != null && data.recent_expenses.length > 0) {
        this.setClientRecentExpanceDataList(data.recent_expenses);
      }
      this.calculateInvoiceTotal();
    }
  }

  setClientServiceDataList(data) {
    this.invoiceData.mServiceDataList = [];
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let service_value = {
          "account_client_invoices_id": data[i].account_client_invoices_id,
          "service_id": data[i].service_id,
          "description": data[i].description,
          "amount": data[i].amount,
          "service_name": data[i].service,
        };
        this.invoiceData.mServiceDataList.push(service_value);
      }
    }
  }

  setClientExpanceDataList(data) {
    this.invoiceData.mExpanceDataList = [];
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let expance_value = {
          "account_client_invoices_id": data[i].account_client_invoices_id,
          "account_client_expenses_detail_id": data[i].account_client_expenses_detail_id,
          "expance_id": data[i].account_expenses_type_master_id,
          "description": data[i].description,
          "amount": data[i].amount,
          "expance_name": data[i].expense_type
        };
        this.invoiceData.mExpanceDataList.push(expance_value);
      }
    }
  }

  setClientRecentExpanceDataList(data) {
    this.invoiceData.mRecentExpanceList = [];
    if (data != null && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        let expance_value = {
          "account_client_invoices_id": data[i].account_client_invoices_id,
          "account_client_expenses_detail_id": data[i].account_client_expenses_detail_id,
          "expance_id": data[i].account_expenses_type_master_id,
          "description": data[i].description,
          "amount": data[i].amount,
          "expance_name": data[i].expense_type
        };
        this.invoiceData.mExpanceDataList.push(expance_value);
      }
    }
  }

  onClientChange() {
    if (this.invoiceData.client_id != null && this.invoiceData.client_id != "") {
      console.log("client id : " + this.invoiceData.client_id);
      this.onSelectGetClientInvoiceData(this.invoiceData.client_id);
    }
  }

  onTaxChange() {
    console.log("tax");
    if (this.invoiceData.onzup_tax_master_id != null && this.invoiceData.onzup_tax_master_id != "") {
      console.log("Tax id : " + this.invoiceData.onzup_tax_master_id);
      this.onSelectGetTaxData(this.invoiceData.onzup_tax_master_id);
    }
  }

  onSearchSelectChangeValue(data) {
    if (data.element.id == "txtClient") {
      this.invoiceData.client_id = data.data.key;
      this.onClientChange();
    } else if (data.element.id == "txtTax") {
      this.invoiceData.onzup_tax_master_id = data.data.key;
      this.onTaxChange();
    } else if (data.element.id == 'txtService') {
      this.mServiceData.service_id = data.data.key;
    } else if (data.element.id == 'txtExpance') {
      this.mExpanceData.expance_id = data.data.key;
    }
  }
  // chnage tax base on value of date
  onChangeDateCheck(isChange) {
    if(this.taxId == null && isChange) {
      this.invoiceData.onzup_tax_master_id = "";
    }

    if (this.appConfig.compareTwoDate(this.mInvoiceDate, "01-06-2017")) {
      this.mTaxDD = this.mSimpleTaxDD;
    } else {
      this.mTaxDD = this.mGSTtaxDD;
    }

  }

  onClickServiceSubmit() {
    if (this.mServiceData.service_id == null || (this.mServiceData.service_id != null && (this.mServiceData.service_id == 0 || this.mServiceData.service_id.trim() == ''))) {
      this.appConfig.showAlertMsg("", "Please select client service.");
    } else if (this.mServiceData.amount == null || (this.mServiceData.amount != null && this.mServiceData.amount.trim() == "")) {
      this.appConfig.showAlertMsg("", "Please enter amount.");
    } else if (isNaN(+this.mServiceData.amount) || parseInt(this.mServiceData.amount) < 0) {
      this.appConfig.showAlertMsg("", "Please enter amount must be numeric.");
    } else {
      // let service_name = this.getValueNameById(this.mServiceDD, this.mServiceData.service_id);
      // this.invoiceData.mServiceDataList.push({
      //   'service_id': this.mServiceData.service_id,
      //   'description': this.mServiceData.description,
      //   'amount': this.mServiceData.amount,
      //   'service_name': service_name
      // });
      this.addServiceInServiceDataList(this.mServiceData)
      this.clearServiceData();
      this.calculateInvoiceTotal();
    }
  }

  clearServiceData() {
    this.mServiceData = {
      description: '',
      service_id: '',
      amount: '',
    }
  }

  onClickServiceRemove(serviceIndex) {
    this.invoiceData.mServiceDataList.splice(serviceIndex, 1);
    this.calculateInvoiceTotal();
  }

  addServiceInServiceDataList(service) {
    let service_name = this.getValueNameById(this.mServiceDD, service.service_id);
    this.invoiceData.mServiceDataList.push({
      'service_id': service.service_id,
      'description': service.description,
      'amount': service.amount,
      'service_name': service_name
    });
  }

  onClickExpanceSubmit() {
    if (this.mExpanceData.expance_id == null || (this.mExpanceData.expance_id != null && (this.mExpanceData.expance_id == 0 || this.mExpanceData.expance_id.trim() == ''))) {
      this.appConfig.showAlertMsg("", "Please select expanse type.");
    } else if (this.mExpanceData.amount == null || (this.mExpanceData.amount != null && this.mExpanceData.amount.trim() == "")) {
      this.appConfig.showAlertMsg("", "Please enter amount.");
    } else if (isNaN(+this.mExpanceData.amount) || parseInt(this.mExpanceData.amount) < 0) {
      this.appConfig.showAlertMsg("", "Please enter amount must be numeric.");
    } else {
      // let expance_name = this.getValueNameById(this.mExpanceDD, this.mExpanceData.expance_id);
      // this.invoiceData.mExpanceDataList.push({
      //   'expance_id': this.mExpanceData.expance_id,
      //   'description': this.mExpanceData.description,
      //   'amount': this.mExpanceData.amount,
      //   'expance_name': expance_name,
      // });
      this.addExpanceIntoExpanceDatalist(this.mExpanceData);
      this.clearExpanceData();
    }
  }

  clearExpanceData() {
    this.mExpanceData = {
      description: '',
      expance_id: '',
      amount: '',
    }
  }

  onClickExpanceRemove(expanceIndex) {
    this.invoiceData.mExpanceDataList.splice(expanceIndex, 1);
  }

  onClickAddRecentExpance(expance, i) {
    this.invoiceData.mRecentExpanceList.splice(i, 1);
    this.addExpanceIntoExpanceDatalist(this.mExpanceData);
    //  console.log(this.invoiceData.mRecentExpanceList);
  }

  addExpanceIntoExpanceDatalist(expance) {
    let expance_name = this.getValueNameById(this.mExpanceDD, expance.expance_id);
    this.invoiceData.mExpanceDataList.push({
      'expance_id': expance.expance_id,
      'description': expance.description,
      'amount': expance.amount,
      'expance_name': expance_name,
      'account_client_expenses_detail_id': (expance.account_client_expenses_detail_id != null) ? expance.account_client_expenses_detail_id : '0'
    });
  }

  getValueNameById(dataDDList, valueId) {
    let value = "";
    if (dataDDList.length != null && dataDDList.length > 0) {
      for (let i = 0; i < dataDDList.length; i++) {
        if (dataDDList[i].key == valueId) {
          value = dataDDList[i].value;
          break;
        }
      }
    }
    return value;
  }

  onClickEditButton() {
    console.log(this.invoiceData);
    if (this.isValidateData()) {
      if (this.appConfig.hasConnection()) {
        this.appConfig.showLoading(this.appMsgConfig.Loading);
        let post_params = this.setPostParamData();
        this.invoiceService.editInvoiceData(post_params,this.invoiceId).then(result => {
          if (result != null) {
            this.appConfig.hideLoading();
            console.log(this.apiResult);
            this.apiResult = result;

            if (this.apiResult.success) {
              this.appConfig.showNativeToast(this.appMsgConfig.InvoiceEditSuccess, "bottom", 3000);
              setTimeout(() => {
                this.navCtrl.pop();
              }, 200)
            } else {
              if (this.apiResult.error != null && this.apiResult.error != "") {
                this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
              } else {
                // this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
                this.appConfig.displayApiErrors(this.apiResult);
              }
            }
          } else {
            this.appConfig.hideLoading();
            this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
          }
        }, error => {
          this.appConfig.hideLoading();
          this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
        });
      } else {
        this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
      }
    }
  }

  setPostParamData() {
    let mInvoiceService = [];
    let mInvoiceExpance = [];

    for (let i = 0; i < this.invoiceData.mServiceDataList.length; i++) {
      mInvoiceService.push({
        service_id: this.invoiceData.mServiceDataList[i].service_id,
        description: this.invoiceData.mServiceDataList[i].description,
        amount: this.invoiceData.mServiceDataList[i].amount,
      });
    }
    for (let i = 0; i < this.invoiceData.mExpanceDataList.length; i++) {
      mInvoiceExpance.push({
        account_expenses_type_master_id: this.invoiceData.mExpanceDataList[i].expance_id,
        description: this.invoiceData.mExpanceDataList[i].description,
        amount: this.invoiceData.mExpanceDataList[i].amount,
        account_client_expenses_detail_id: (this.invoiceData.mExpanceDataList[i].account_client_expenses_detail_id != null) ? this.invoiceData.mExpanceDataList[i].account_client_expenses_detail_id : ''
      });
    }

    let data = {
      '_method': 'patch',
      api_token: this.api_token,
      account_id:this.invoiceData.account_id,
      user_id:this.invoiceData.user_id,
      client_id: this.invoiceData.client_id,
      billingaddress: this.invoiceData.billingaddress,
      invoice_prefix: this.invoiceData.invoice_prefix,
      invoicenumber: this.invoiceData.invoicenumber,
      invoicedate: this.appConfig.transformDate(this.mInvoiceDate),
      invoiceduedate: (this.mOverdueDate != null && this.mOverdueDate != "") ? this.appConfig.transformDate(this.mOverdueDate) : " ",
      onzup_tax_master_id: this.invoiceData.onzup_tax_master_id,
      remark: this.invoiceData.remark,
      discount: this.invoiceData.discount,
      invoice_total: this.invoiceData.invoice_total,
      roundof: this.invoiceData.roundof,
      total: this.invoiceData.total,
      current_balance : this.invoiceData.current_balance,
      previous_outstanding_amount : this.invoiceData.current_balance
    };
    data['invoiceitems'] = mInvoiceService;
    data['expenseitems'] = mInvoiceExpance;
    return data;
  }

  isValidateData() {
    let isValidate = true;
    if (!this.isClientValidate()) {
      isValidate = false;
    } else if (!this.isInvoicePrefixValidate()) {
      isValidate = false;
    } else if (!this.isInvoiceNumberValidate()) {
      isValidate = false;
    } else if (!this.isValidateInvoiceDuedate()) {
      isValidate = false;
    } else if (!this.isValidateInVoiceTax()) {
      isValidate = false;
    } else if (!this.isClientServiceDetailValidate()) {
      isValidate = false;
    }
    return isValidate;
  }

  isClientValidate() {
    let valid = true;
    if (this.invoiceData.client_id == null || (this.invoiceData.client_id != null && (this.invoiceData.client_id == '' || this.invoiceData.client_id == 0))) {
      valid = false;
      this.appConfig.showAlertMsg("", "Please select client");
    }
    return valid;
  }

  isInvoicePrefixValidate() {
    let valid = true;
    if (this.invoiceData.invoice_prefix == null || (this.invoiceData.invoice_prefix != null && this.invoiceData.invoice_prefix.trim() == '')) {
      valid = false;
      this.appConfig.showAlertMsg("", "Enter invoice prefix");
    }
    return valid;
  }

  isInvoiceNumberValidate() {
    let valid = true;
    if (this.invoiceData.invoicenumber == null || (this.invoiceData.invoicenumber != null && this.invoiceData.invoicenumber == '')) {
      valid = false;
      this.appConfig.showAlertMsg("", "Enter invoice number");
    } else if (isNaN(+this.invoiceData.invoicenumber) || parseInt(this.invoiceData.invoicenumber) < 0) {
      valid = false;
      this.appConfig.showAlertMsg("", "Invoice number must be numeric.");
    }
    return valid;
  }

  isValidateInvoiceDuedate() {
    let valid = true;
    if (this.mOverdueDate != null && this.mOverdueDate != " ") {
      if (this.appConfig.compareTwoDate(this.mInvoiceDate, this.mOverdueDate)) {
        valid = false;
        this.appConfig.showAlertMsg("", "Overdue date should not less than invoice date");
      }
    }
    return valid;
  }

  isValidateInVoiceTax() {
    let valid = true;
    if (this.invoiceData.onzup_tax_master_id == null || (this.invoiceData.onzup_tax_master_id != null && (this.invoiceData.onzup_tax_master_id == " " || this.invoiceData.onzup_tax_master_id == "0"))) {
      valid = false;
      this.appConfig.showAlertMsg("", "Please select tax");
    }
    return valid;
  }

  isClientServiceDetailValidate() {
    let valid = true;
    if (this.invoiceData.mServiceDataList == null || (this.invoiceData.mServiceDataList != null && this.invoiceData.mServiceDataList.length <= 0)) {
      valid = false;
      this.appConfig.showAlertMsg("", "Client service detail required");
    }
    return valid;
  }

  openItemEditModal(index, item, valuedd, title) {
    this.InvoiceSelectModel = this.modalCtrl.create(InvoiceSelectModel, { index: index, item: item, valuedd: valuedd, title: title }, { enableBackdropDismiss: false });

    this.InvoiceSelectModel.onDidDismiss((index) => {
      if (index != null) {
        this.calculateInvoiceTotal();
      }
    });

    this.InvoiceSelectModel.present();
  }

  onSelectChangeValue(data) {
    if (data.itemType == 'service') {
      let service_name = this.getValueNameById(this.mServiceDD, data.itemData.service_id);
      this.invoiceData.mServiceDataList[data.itemIndex].description = data.itemData.description;
      this.invoiceData.mServiceDataList[data.itemIndex].service_id = data.itemData.service_id;
      this.invoiceData.mServiceDataList[data.itemIndex].amount = data.itemData.amount;
      this.invoiceData.mServiceDataList[data.itemIndex].service_name = service_name;
    } else {
      let expance_name = this.getValueNameById(this.mExpanceDD, data.itemData.expance_id);
      this.invoiceData.mExpanceDataList[data.itemIndex].description = data.itemData.description;
      this.invoiceData.mExpanceDataList[data.itemIndex].service_id = data.itemData.expance_id;
      this.invoiceData.mExpanceDataList[data.itemIndex].amount = data.itemData.amount;
      this.invoiceData.mExpanceDataList[data.itemIndex].expance_name = expance_name;
    }
    this.calculateInvoiceTotal();
  }

  onSelectGetTaxData(tax_id) {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.invoiceService.getTaxesData(this.api_token, tax_id).then(result => {
        if (result != null) {
          this.appConfig.hideLoading();

          this.apiResult = result;

          if (this.apiResult.success) {
            this.setTaxValueData(this.apiResult);
          } else {
            if (this.apiResult.error != null && this.apiResult.error != "") {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
            } else {
              this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
            }
          }
        } else {
          this.appConfig.hideLoading();
          this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
        }
      }, error => {
        this.appConfig.hideLoading();
        this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
      });
    } else {
      this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    }
  }

  setTaxValueData(data) {
    this.mTaxValueData = [];
    if (data.taxes != null && Object.keys(data.taxes).length > 0) {
      for (let i = 0; i < data.taxes.length; i++) {
        let taxObj = {
          "on_basis": data.taxes[i].on_basis,
          "tax_name": data.taxes[i].tax_name,
          "value": data.taxes[i].value,
          "amount": 0
        }
        this.mTaxValueData.push(taxObj);
      }
      this.calculateInvoiceTotal();
    } else {
      this.mTaxValueData = [];
    }
  }

  onChangeDiscount() {
    this.calculateInvoiceTotal();
  }

  calculateInvoiceTotal() {
    let totalInvoiceAmount = 0.0;
    let totalTax = 0.0;
    let totalWithDiscount = 0.0;
    let discountAmount = 0.0;

    if (this.invoiceData.discount != null && this.invoiceData.discount != '') {
      discountAmount = parseFloat(this.invoiceData.discount);
    } else {
      discountAmount = 0.00;
    }
    if (this.invoiceData.mServiceDataList.length > 0) {
      for (let i = 0; i < this.invoiceData.mServiceDataList.length; i++) {
        totalInvoiceAmount += parseFloat(this.invoiceData.mServiceDataList[i].amount);
      }

      totalWithDiscount = totalInvoiceAmount - discountAmount;

      if (this.mTaxValueData.length > 0) {
        for (let i = 0; i < this.mTaxValueData.length; i++) {
          let onBasis = parseFloat(this.mTaxValueData[i].on_basis);
          let onBasisValue = parseFloat(this.mTaxValueData[i].value);
          let taxAmount = (onBasisValue * totalWithDiscount) / onBasis;
          this.mTaxValueData[i].amount = taxAmount.toFixed(2);
          totalTax += taxAmount;
        }
      }
    } else {
      this.clearCalculatedData();
    }
    let TotalWithTax = totalWithDiscount + totalTax;
    this.invoiceData.roundof = (Math.round(TotalWithTax) - TotalWithTax).toFixed(2);
    this.invoiceData.invoice_total = totalInvoiceAmount.toFixed(2);
    this.invoiceData.total = Math.round(TotalWithTax).toFixed(2);
  }

  clearCalculatedData() {
    this.invoiceData.roundof = 0.00;
    this.invoiceData.invoice_total = 0.00;
    this.invoiceData.total = 0.00;
    this.invoiceData.total = 0.00
    if (this.mTaxValueData.length > 0) {
      for (let i = 0; i < this.mTaxValueData.length; i++) {
        this.mTaxValueData[i].amount = 0.00;
      }
    }
  }
}
