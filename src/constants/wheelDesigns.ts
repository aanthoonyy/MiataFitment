// Wheel designs are a visual choice layered on top of the fitment geometry:
// every design occupies the same space the default one does, so nothing about
// sizing, positioning or the bounce simulation changes when you switch.
//
// To add one: drop the .glb in public/ and add a line here. Nothing else. The
// fitter measures what it needs off the model itself at load time -- which end
// of the axle carries the face, and where the hub plate sits -- so a design
// only has to say what it's called and where it lives.
//
// Labels are the .glb filenames; rename them freely, but leave `value` alone
// once shipped, since it's what gets persisted in the user's browser.
export const WHEEL_DESIGNS = [
  { value: "default", label: "Default", model: null },
  { value: "03s", label: "03S", model: "/03S.glb" },
  { value: "33gtr", label: "33GTR", model: "/33GTR.glb" },
  { value: "57g", label: "57G", model: "/57G.glb" },
  { value: "57x", label: "57X", model: "/57X.glb" },
  { value: "350z", label: "350Z", model: "/350Z.glb" },
  { value: "bazeria", label: "Bazeria", model: "/Bazeria.glb" },
  { value: "bbsrs", label: "BBSRS", model: "/BBSRS.glb" },
  { value: "be30", label: "BE30", model: "/BE30.glb" },
  { value: "cerberus", label: "Cerberus", model: "/Cerberus.glb" },
  { value: "cr01", label: "CR01", model: "/CR01.glb" },
  { value: "e01", label: "E01", model: "/E01.glb" },
  { value: "e03", label: "E03", model: "/E03.glb" },
  { value: "e05", label: "E05", model: "/E05.glb" },
  { value: "emitz", label: "Emitz", model: "/Emitz.glb" },
  { value: "eurodh", label: "EuroDH", model: "/EuroDH.glb" },
  { value: "fmesh", label: "FMesh", model: "/FMesh.glb" },
  { value: "futura", label: "Futura", model: "/Futura.glb" },
  { value: "g5", label: "G5", model: "/G5.glb" },
  { value: "501", label: "HRE 501", model: "/501.glb" },
  { value: "jilba", label: "Jilba", model: "/Jilba.glb" },
  { value: "lm", label: "LM", model: "/LM.glb" },
  { value: "lmgt4", label: "LMGT4", model: "/LMGT4.glb" },
  { value: "longchamps", label: "Longchamps", model: "/Longchamps.glb" },
  { value: "meisters", label: "Meisters", model: "/Meisters.glb" },
  { value: "minerva", label: "Minerva", model: "/Minerva.glb" },
  { value: "minilite", label: "Minilite", model: "/Minilite.glb" },
  { value: "mk1", label: "Mk1", model: "/Mk1.glb" },
  { value: "mk2", label: "Mk2", model: "/Mk2.glb" },
  { value: "mk3", label: "Mk3", model: "/Mk3.glb" },
  { value: "model5", label: "Model5", model: "/Model5.glb" },
  { value: "monoblock", label: "Monoblock", model: "/Monoblock.glb" },
  { value: "moon", label: "Moon", model: "/Moon.glb" },
  { value: "nt03", label: "NT03", model: "/NT03.glb" },
  { value: "oni", label: "Oni", model: "/Oni.glb" },
  { value: "orden", label: "Orden", model: "/Orden.glb" },
  { value: "p1", label: "P1", model: "/P1.glb" },
  { value: "phantom", label: "Phantom", model: "/Phantom.glb" },
  { value: "r34gtr", label: "R34GTR", model: "/R34GTR.glb" },
  { value: "r35", label: "R35", model: "/R35.glb" },
  { value: "revo", label: "Revo", model: "/Revo.glb" },
  { value: "rgtsc", label: "RGTSC", model: "/RGTSC.glb" },
  { value: "riverge", label: "Riverge", model: "/Riverge.glb" },
  { value: "rpf1", label: "RPF1", model: "/RPF1.glb" },
  { value: "rswata", label: "RSWata", model: "/RSWata.glb" },
  { value: "rswata4", label: "RSWata4", model: "/RSWata4.glb" },
  { value: "rturbo", label: "RTurbo", model: "/RTurbo.glb" },
  { value: "ryvers", label: "Ryvers", model: "/Ryvers.glb" },
  { value: "s13stock", label: "S13Stock", model: "/S13Stock.glb" },
  { value: "s14stock", label: "S14Stock", model: "/S14Stock.glb" },
  { value: "s15stock", label: "S15Stock", model: "/S15Stock.glb" },
  { value: "shadow", label: "Shadow", model: "/Shadow.glb" },
  { value: "shak", label: "Shak", model: "/Shak.glb" },
  { value: "sprint", label: "Sprint", model: "/Sprint.glb" },
  { value: "sp1", label: "SSR SP1", model: "/sp1.glb" },
  { value: "stockies2", label: "stockies2", model: "/stockies2.glb" },
  { value: "advan", label: "Super Advan", model: "/superadvan.glb" },
  { value: "svt1", label: "SVT1", model: "/SVT1.glb" },
  { value: "swirlies", label: "Swirlies", model: "/Swirlies.glb" },
  { value: "tarmac", label: "Tarmac", model: "/Tarmac.glb" },
  { value: "tcii", label: "TCII", model: "/TCII.glb" },
  { value: "te37v", label: "TE37V", model: "/TE37V.glb" },
  { value: "teardrops", label: "Teardrops", model: "/Teardrops.glb" },
  { value: "versus", label: "Versus", model: "/Versus.glb" },
  { value: "vessv", label: "VESSV", model: "/VESSV.glb" },
  { value: "vesv", label: "VESV", model: "/VESV.glb" },
  { value: "vienna", label: "Vienna", model: "/Vienna.glb" },
  { value: "vlcalais", label: "VLCalais", model: "/VLCalais.glb" },
  { value: "vlwalkinshaw", label: "VLWalkinshaw", model: "/VLWalkinshaw.glb" },
  { value: "vngroupa", label: "VNGroupA", model: "/VNGroupA.glb" },
  { value: "vnss", label: "VNSS", model: "/VNSS.glb" },
  { value: "vskf", label: "VSKF", model: "/VSKF.glb" },
  { value: "vsx", label: "VSX", model: "/VSX.glb" },
  { value: "vsxx", label: "VSXX", model: "/VSXX.glb" },
  { value: "vtss", label: "VTSS", model: "/VTSS.glb" },
  { value: "vx610", label: "VX610", model: "/VX610.glb" },
  { value: "vxss", label: "VXSS", model: "/VXSS.glb" },
  { value: "vygts", label: "VYGTS", model: "/VYGTS.glb" },
  { value: "vysigs", label: "VYSigs", model: "/VYSigs.glb" },
  { value: "vyss", label: "VYSS", model: "/VYSS.glb" },
  { value: "vzgts", label: "VZGTS", model: "/VZGTS.glb" },
  { value: "vzr8", label: "VZR8", model: "/VZR8.glb" },
  { value: "wch", label: "WCH", model: "/WCH.glb" },
  { value: "wires", label: "Wires", model: "/Wires.glb" },
  { value: "wm1", label: "WM1", model: "/WM1.glb" },
  { value: "xc8", label: "XC8", model: "/XC8.glb" },
  { value: "xd9", label: "XD9", model: "/XD9.glb" },
  { value: "xt7", label: "XT7", model: "/XT7.glb" },
  { value: "yayoi", label: "Yayoi", model: "/Yayoi.glb" },
] as const;

export type WheelDesign = (typeof WHEEL_DESIGNS)[number]["value"];

export const DEFAULT_WHEEL_DESIGN: WheelDesign = "default";

// null for the built-in procedural wheel, which has no model to load.
export function wheelModelPath(design: WheelDesign): string | null {
  return WHEEL_DESIGNS.find((d) => d.value === design)?.model ?? null;
}
