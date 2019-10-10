import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ClientService } from 'app/shared/services/client.service';
import { ClientE, TypeClientEnum } from '../exchange/e_client';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DataTableHandler } from 'app/config/dataTableHandler';
import { FeedBackService, COMPONENT_NAME, OPERATION_TYPE } from 'app/config/feed-back.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent extends DataTableHandler implements OnInit {

  currentDateTime = Date.now();
  clients: ClientE[] = [];

  clientForm: FormGroup;

  operation = 'add';
  clientSelectionne: ClientE;

  constructor(private formBuilder: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private feedBackService: FeedBackService) {
    super();
  }

  ngOnInit() {
    this.initClient();
    this.initDataTable();
    this.clients = this.route.snapshot.data.clients;
  }

  ngAfterViewInit() {
    this.nextTrigger();
    this.feedBackService.setComponentName(COMPONENT_NAME.CLIENT);
  }

  ngOnDestroy(): void {
    this.unsubscribeTrigger();
  }

  initClient() {
    this.clientSelectionne = new ClientE();
    this.clientSelectionne.type = TypeClientEnum.NORMAL;
    this.createForms();
  }

  createForms() {
    this.clientForm = this.formBuilder.group({
      cin: '',
      name: ['', Validators.required],
      raison_sociale: '',
      type: 'NORMAL',
      rip: ['', Validators.min(0)],
      phone: ['', Validators.minLength(10)],
      address: '',
      email: ['', Validators.email],
    });
  }

  get name() { return this.clientForm.get('name') as FormControl; }

  get rip() { return this.clientForm.get('rip') as FormControl; }

  get phone() { return this.clientForm.get('phone') as FormControl; }

  get email() { return this.clientForm.get('email') as FormControl; }

  loadClients() {
    this.clientService.getAll().subscribe(
      data => {
        this.clients = data
        this.rerender();
      },
      error => {
        this.feedBackService.feedBackLoadingData(COMPONENT_NAME.CHARGES);
      }
    )
  }

  addClient() {
    const clientTemp = this.clientForm.value;

    console.log(clientTemp);
    this.clientService.add(clientTemp).subscribe(
      res => {
        this.loadClients();
        this.feedBackService.feedBackInsert();
      },
      error => {
        this.feedBackService.feedBackInsert(OPERATION_TYPE.FAILURE);
      }
    );
  }

  updateClient() {
    const clientTemp = this.clientForm.value;
    clientTemp.idClient = this.clientSelectionne.idClient;

    this.clientService.update(clientTemp).subscribe(
      res => {
        this.loadClients();
        this.feedBackService.feedBackUpdate();
      },
      error => {
        this.feedBackService.feedBackUpdate(OPERATION_TYPE.FAILURE);
      }
    );
  }

  deleteClient() {
    this.clientService.delete(this.clientSelectionne.idClient).subscribe(
      res => {
        this.loadClients();
        this.feedBackService.FeedBackDelete();
      },
      error => {
        this.feedBackService.FeedBackDelete(OPERATION_TYPE.FAILURE);
      }
    );
  }

  operationError() {
    this.feedBackService.feedBackOperationFailure();
  }

  getClientType(type: string): string {
    switch (type) {
      case 'NORMAL':
        return 'عادي';

      case 'GROSSISTE':
        return 'تاجر بالجملة';

      case 'SEMI_GROSSISTE':
        return 'تاجر بنصف الجملة';

      default:
        return 'عادي';
    }
  }
}
