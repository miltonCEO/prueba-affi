async selectGuarantorType() {
  // Mostrar una alerta de selección de tipo de deudor
  const { value: option } = await Swal.fire({
    title: 'Seleccione el tipo de deudor solidario',
    input: 'select',
    confirmButtonColor: '#4285F4',
    confirmButtonText: 'Aceptar',
    inputOptions: {
      '1': 'Deudor solidario solvente',
      '2': 'Deudor solidario solvente con finca raíz',
    },
    inputPlaceholder: '-- Selecciona una opción --',
    showCloseButton: true,
    // Validar que el usuario seleccione una opción
    inputValidator: (value) => (value ? null : 'Debe seleccionar una opción'),
  });

  // Si el usuario selecciona una opción, proceder a crear un nuevo deudor
  if (option) {
    this.setCreateNewGuarantor();
  }
}

setCreateNewGuarantor() {
  // Activar indicador de carga
  this.loading = true;

  // Mostrar confirmación para proceder con la acción
  Swal.fire({
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4285F4',
    cancelButtonColor: '#d33',
    title: '¿Está seguro que desea realizar esta acción?',
    text:
      this.guarantorList.length > 1
        ? 'Una vez creados no podrá eliminarlos'
        : 'Una vez creado no podrá eliminarlo',
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    // Si el usuario confirma, proceder con la creación
    if (result.value) {
      this.handleCreateGuarantorRequest();
    } else {
      // Si cancela, desactivar el indicador de carga
      this.loading = false;
    }
  });
}

private handleCreateGuarantorRequest() {
  // Verificar que la aplicación tenga los datos necesarios
  if (!this.application?.id || !this.application?.realEstateId) return;

  // Obtener el valor de la causal desde el elemento del DOM
  const causalElement = document.getElementById('causal-select-guarantor-detail');
  this.causal = causalElement ? (causalElement as HTMLInputElement).value : '';
  // Obtener el código de la causal basado en su descripción
  this.causalCode = this.getCausalCodeByDescription(this.causal);

  // Actualizar la información de la aplicación con la causal
  this.application.reopenCausal = this.causal;
  this.application.reopenCausalCode = this.causalCode;

  // Preparar la solicitud para crear deudores
  const createGuarantorsRequest = {
    userRol: this.user?.roles[0],
    userId: this.user.id,
    guarantorList: this.guarantorList,
    causal: this.causal,
  };

  // Seleccionar el método adecuado según el tipo de flujo de la aplicación
  const createGuarantorFn =
    this.application?.flowType === 'MANUAL'
      ? this.guarantorsS.createGuarantorManual
      : this.guarantorsS.createGuarantor;

  // Ejecutar la solicitud para crear deudores
  createGuarantorFn.call(
    this.guarantorsS,
    this.application.id,
    this.application.realEstateId,
    createGuarantorsRequest,
    this.causal
  ).subscribe(
    // Manejar el éxito de la creación
    () => this.handleSuccess(),
    // Mostrar mensaje de error si la creación falla
    () =>
      this.showSwalMessage(
        'error',
        this.guarantorList.length > 1
          ? 'Ocurrió un error creando los nuevos deudores'
          : 'Ocurrió un error creando el nuevo deudor',
        false
      )
  );
}

private handleSuccess() {
  // Verificar que la aplicación exista
  if (!this.application) return;

  // Actualizar el estado de la aplicación
  this.application.guarantorsAdded = false;
  this.application.state = ApplicationState.REOPEN;

  // Crear objeto editable con los datos de la aplicación actualizados
  const editableApplication: SimpleEditableApplication = {
    userUpdating: {
      userRol: this.user?.roles[0],
      userId: this.user.id,
    },
    application: this.application,
  };

  // Enviar los datos actualizados al backend
  this.dataBasic.patchApplication(editableApplication).subscribe(() => {
    // Mostrar mensaje de éxito y recargar la página
    this.showSwalMessage(
      'success',
      this.guarantorList.length > 1
        ? 'Se han creado los nuevos deudores'
        : 'Se ha creado el nuevo deudor',
      true,
      () => window.location.reload()
    );
  });
}

private showSwalMessage(
  icon: 'success' | 'error',
  title: string,
  showConfirmButton: boolean,
  callback?: () => void
) {
  // Mostrar mensaje con SweetAlert
  Swal.fire({
    icon,
    title,
    showConfirmButton,
  }).then(() => {
    // Ejecutar acción adicional si se proporciona
    if (callback) callback();
  });
}
