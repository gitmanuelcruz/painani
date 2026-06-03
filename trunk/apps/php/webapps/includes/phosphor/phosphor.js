var head = document.getElementsByTagName("head")[0];

for (weight of ["regular", "thin", "light", "bold", "fill", "duotone"]) {
  var link = document.createElement("link");
  link.rel  = "stylesheet";
  link.type = "text/css";
  link.href = context+"includes/phosphor/phosphoe-"+weight+".css";
  head.appendChild(link);
}