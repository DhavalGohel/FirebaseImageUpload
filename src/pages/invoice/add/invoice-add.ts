import { Component ,ViewChild} from '@angular/core';
import { NavController,NavParams,Platform,Navbar,Events} from 'ionic-angular';
import { AppConfig, AppMsgConfig } from '../../../providers/AppConfig';

import { InvoiceService } from '../../../providers/invoice-service/invoice-services';

@Component({
  selector: 'page-invoice-add',
  templateUrl: 'invoice-add.html',
})

export class InvoiceAddPage {
  @ViewChild('navbar') navBar: Navbar;

  public apiResult: any;
  public api_token = this.appConfig.mToken;

  public selectedTab: string = 'part_1';
  public invoiceData: any = {
    client_id: null,
    remark:'',
  }

  public mClientDD: any = [];
  public mTaxDD: any = [];
  public mServiceDD: any = [];
  public mExpanceDD: any = [];

  public mInvoiceDate: any = new Date().toISOString();
  public mOverdueDate: any  = null;

  public mServiceData: any =  {
    discription:'',
    service_id: '',
    amount: '',
  }

  public mExpanceData: any =  {
    discription:'',
    expance_id: '',
    amount: '',
  }

  public mServiceDataList: any = [];
  public mExpanceDataList: any = [];
  public mRecentExpanceList: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public appConfig: AppConfig,
    public appMsgConfig: AppMsgConfig,
    public invoiceService: InvoiceService,
    public eventsCtrl: Events) {

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

    this.onLoadGetCreateData();
  }

  ionViewWillLeave() {
    this.eventsCtrl.unsubscribe("search-select:refresh_value");
  }

  onChangeTabFromBackButton() {
    if (this.selectedTab == "part_3") {
      this.onClickSetTab("part_2");
    } else if (this.selectedTab == "part_2") {
      this.onClickSetTab("part_1");
    } else if (this.selectedTab == "part_1"){
      this.navCtrl.pop();
    }
  }

  onClickSetTab(tabName) {
    setTimeout(() => {
      this.selectedTab = tabName;
    }, 500);
  }

  onLoadGetCreateData() {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.invoiceService.getCreateData(this.api_token).then(result => {
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
      this.invoiceData.invoice_date = this.appConfig.transformDate(this.mInvoiceDate);
      this.invoiceData.overdue_date = this.appConfig.transformDate(this.mOverdueDate);
      this.invoiceData.client_id = "";

      if (data.invoice_prefix != null && data.invoice_prefix != "") {
        this.invoiceData.invoice_prefix = data.invoice_prefix;
      }

      if (data.invoice_number != null && data.invoice_number != "") {
        this.invoiceData.invoicenumber = data.invoice_number;
      }
      if (data.total_invoice != null && data.total_invoice != "") {
        this.invoiceData.total_bill = data.total_invoice.total_bill;
        this.invoiceData.total_paid = data.total_invoice.total_paid;
        this.invoiceData.total_pending = data.total_invoice.total_pending;
        this.invoiceData.current_balance = data.total_invoice.current_balance;
      }

      if (data.clients != null && Object.keys(data.clients).length > 0) {
        this.mClientDD = this.appConfig.getFormattedArray(data.clients);
      }

      if(data.taxes != null && Object.keys(data.taxes).length > 0){
        this.mTaxDD = this.appConfig.getFormattedArray(data.taxes);
      }

      if(data.services != null && Object.keys(data.services).length > 0){
        this.mServiceDD = this.appConfig.getFormattedArray(data.services);
      }

      if(data.expense_types != null && Object.keys(data.expense_types).length > 0){
        this.mExpanceDD = this.appConfig.getFormattedArray(data.expense_types);
      }

    }
  }

  onSelectGetClientInvoiceData(client_id) {
    if (this.appConfig.hasConnection()) {
      this.appConfig.showLoading(this.appMsgConfig.Loading);

      this.invoiceService.getClientInvoiceData(this.api_token,client_id).then(result => {
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
    console.log(data);

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
      if(data.services != null && data.services.length > 0){
        this.mServiceDataList = data.services;
      }

      if(data.recent_expenses != null && data.recent_expenses.length > 0){
        this.mRecentExpanceList = data.recent_expenses;
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
    if (this.invoiceData.tax_id != null && this.invoiceData.tax_id != "") {
      console.log("Tax id : " + this.invoiceData.tax_id);
    }
  }

  onSearchSelectChangeValue(data) {
    if (data.element.id == "txtClient") {
      this.invoiceData.client_id = data.data.key;
      this.onClientChange();
    }else if(data.element.id == "txtTax"){
      this.invoiceData.tax_id = data.data.key;
      this.onTaxChange();
    } else if (data.element.id == 'txtService'){
      this.mServiceData.service_id = data.data.key;
    } else if (data.element.id == 'txtExpance'){
      this.mExpanceData.expance_id = data.data.key;
    }
  }

  onClickServiceSubmit(){
    if(this.mServiceData.service_id == null || (this.mServiceData.service_id != null && (this.mServiceData.service_id == 0 || this.mServiceData.service_id.trim() == ''))){
      this.appConfig.showAlertMsg("", "Please select client service.");
    }else if(this.mServiceData.amount == null || (this.mServiceData.amount != null && this.mServiceData.amount.trim() == "")){
        this.appConfig.showAlertMsg("","Please enter amount.");
    } else if (isNaN(+this.mServiceData.amount) || parseInt(this.mServiceData.amount) < 0) {
      this.appConfig.showAlertMsg("","Please enter amount must be numeric.");
    }else {
      let service_name = this.getValueNameById(this.mServiceDD,this.mServiceData.service_id);
      this.mServiceDataList.push({
        'service_id':this.mServiceData.service_id,
        'description':this.mServiceData.description,
        'amount':this.mServiceData.amount,
        'service_name':service_name
      });
      this.clearServiceData();
    }
  }

  clearServiceData(){
    this.mServiceData = {
      discription : '',
      service_id : '',
      amount : '',
    }
  }

  onClickServiceRemove(serviceIndex){
      this.mServiceDataList.splice(serviceIndex,1);
  }

  onClickExpanceSubmit(){
    if(this.mExpanceData.expance_id == null || (this.mExpanceData.expance_id != null && (this.mExpanceData.expance_id == 0 || this.mExpanceData.expance_id.trim() == ''))){
      this.appConfig.showAlertMsg("", "Please select expance type.");
    }else if(this.mExpanceData.amount == null || (this.mExpanceData.amount != null && this.mExpanceData.amount.trim() == "")){
        this.appConfig.showAlertMsg("","Please enter amount.");
    } else if (isNaN(+this.mExpanceData.amount) || parseInt(this.mExpanceData.amount) < 0) {
      this.appConfig.showAlertMsg("","Please enter amount must be numeric.");
    }else {
      let expance_name = this.getValueNameById(this.mExpanceDD,this.mExpanceData.expance_id);
      this.mExpanceDataList.push({
        'expance_id':this.mExpanceData.expance_id,
        'description':this.mExpanceData.description,
        'amount':this.mExpanceData.amount,
        'expance_name':expance_name,
      });
      this.clearExpanceData();
    }
  }

  clearExpanceData(){
    this.mExpanceData = {
      discription : '',
      expance_id : '',
      amount : '',
    }
  }

  onClickExpanceRemove(expanceIndex){
      this.mExpanceDataList.splice(expanceIndex,1);
  }

  onClickAddRecentExpance(expance,i){
    this.mRecentExpanceList.slice(i,1);
    this.mExpanceDataList.push({
      'expance_id':expance.account_expenses_type_master_id,
      'description':expance.description,
      'amount':expance.amount,
      'expance_name':expance.category,
    });
    console.log(this.mRecentExpanceList);
  }

  getValueNameById(dataDDList,valueId){
    let value = "";
    if(dataDDList.length != null && dataDDList.length > 0){
        for(let i = 0; i <dataDDList.length; i++){
          if(dataDDList[i].key == valueId){
            value = dataDDList[i].value;
            break;
          }
        }
    }
    return value;
  }

  onClickCreateButton() {
    console.log(this.invoiceData);
    console.log("called click button...");
    if(this.isValidateData()){
      console.log("valied");
    }
    // if (this.appConfig.hasConnection()) {
    //   this.appConfig.showLoading(this.appMsgConfig.Loading);
    //
    //   this.invoiceService.getClientInvoiceData(this.api_token,client_id).then(result => {
    //     if (result != null) {
    //       this.appConfig.hideLoading();
    //
    //       this.apiResult = result;
    //
    //       if (this.apiResult.success) {
    //         this.setClientInvoiceData(this.apiResult);
    //       } else {
    //         if (this.apiResult.error != null && this.apiResult.error != "") {
    //           this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.apiResult.error);
    //         } else {
    //           this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
    //         }
    //       }
    //     } else {
    //       this.appConfig.hideLoading();
    //       this.appConfig.showNativeToast(this.appMsgConfig.NetworkErrorMsg, "bottom", 3000);
    //     }
    //   }, error => {
    //     this.appConfig.hideLoading();
    //     this.appConfig.showAlertMsg(this.appMsgConfig.Error, this.appMsgConfig.NetworkErrorMsg);
    //   });
    // } else {
    //   this.appConfig.showAlertMsg(this.appMsgConfig.InternetConnection, this.appMsgConfig.NoInternetMsg);
    // }
  }

  isValidateData(){
    let isValidate = true;
    if(!this.isClientValidate()){
       isValidate = false;
    }else if(!this.isInvoicePrefixValidate()){
       isValidate = false;
    }else if(!this.isInvoiceNumberValidate()){
       isValidate = false;
    }else if(!this.isClientServiceDetailValidate()){
       isValidate = false;
    }
    return isValidate;
  }

  isClientValidate(){
    let valid = true;
    if(this.invoiceData.client_id == null || (this.invoiceData.client_id != null && (this.invoiceData.client_id.trim() == '' || this.invoiceData.client_id == 0))){
        valid = false;
        this.appConfig.showAlertMsg("", "Please select client");
    }
    return valid;
  }

  isInvoicePrefixValidate(){
    let valid = true;
    if(this.invoiceData.invoice_prefix == null || (this.invoiceData.invoice_prefix != null && this.invoiceData.invoice_prefix.trim() == '')){
        valid = false;
        this.appConfig.showAlertMsg("", "Enter invoice prefix");
    }
    return valid;
  }

  isInvoiceNumberValidate(){
    let valid = true;
    if(this.invoiceData.invoicenumber == null || (this.invoiceData.invoicenumber != null && this.invoiceData.invoicenumber.trim() == '')){
        valid = false;
        this.appConfig.showAlertMsg("", "Enter invoice number");
    }else if (isNaN(+this.invoiceData.invoicenumber) || parseInt(this.invoiceData.invoicenumber) < 0) {
      valid = false;
      this.appConfig.showAlertMsg("","Invoice number must be numeric.");
    }
    return valid;
  }

  isClientServiceDetailValidate(){
    let valid = true;
    if(this.invoiceData.invoiceitems == null || (this.invoiceData.invoiceitems != null && this.invoiceData.invoiceitems.length <= 0)){
        valid = false;
        this.appConfig.showAlertMsg("", "Client service detail required");
    }
    return valid;
  }

}
