import { Vue } from "vue-property-decorator";

export function toastSuccess(vue: Vue, message: any) {
  const h = vue.$createElement;
  const vNodesMsg = h("div", { class: ["d-flex", "align-items-center"] }, [
    h("font-awesome-icon", {
      props: { icon: "check-circle", "fixed-width": true, size: "lg" },
      class: ["mr-2"]
    }),
    `${message}`
  ]);

  vue.$bvToast.toast([vNodesMsg], {
    variant: "success",
    solid: true,
    // noAutoHide: true,
    noCloseButton: true,
    bodyClass: "shadow rounded p-3"
  });
}

export function toastFail(vue: Vue, message: any) {
  const h = vue.$createElement;

  const vNodesMsg = h("div", { class: ["d-flex", "align-items-center"] }, [
    h("font-awesome-icon", {
      props: { icon: "exclamation-circle", "fixed-width": true, size: "lg" },
      class: ["mr-2"]
    }),
    `${message}`
  ]);

  vue.$bvToast.toast(vNodesMsg, {
    variant: "danger",
    solid: true,
    // noAutoHide: true,
    noCloseButton: true,
    bodyClass: "shadow rounded p-3"
  });
}
