<%@ page contentType="text/html; charset=utf-8" autoFlush="true" language="java" trimDirectiveWhitespaces="true" 
	import="java.sql.*,org.postgresql.Driver,java.util.*,java.io.*, java.math.*" 
%>
<%@ page import="net.sf.jasperreports.engine.*"%> 
<%@ page import="net.sf.jasperreports.view.*"%>
<% response.setHeader("Access-Control-Allow-Origin","*");%>
<% request.setAttribute("usuariodb","informe_painani");%>
<%@ include file="../../connection/conexion.jsp"%>
<%
	String id_paquete = request.getParameter("pid_paquete") != null ? request.getParameter("pid_paquete") : "";
	String path = application.getRealPath("");	
	String rutainfo = path+"notificaciones/paquete/";
	String rutaimgfondo = path+"imagenes/";
	
	Map parameters = new HashMap();
	parameters.put("pid_paquete",id_paquete);
	parameters.put("SUBREPORT_DIR",rutainfo);
	
	File reportFile = new File(rutainfo+"paquete_notificaciones.jasper");
	
	if(!reportFile.exists())
		throw new JRRuntimeException("Archivo jasper no Encontrado.");		
	
	byte[] bytes = JasperRunManager.runReportToPdf(reportFile.getPath(),parameters, conn);	
						
	response.setContentType("application/Pdf");
	response.setHeader("Content-Disposition", "attachment; filename=\"informe_paquete_notif.pdf\""); 
	response.setContentLength(bytes.length);
	
	ServletOutputStream ouputStream = response.getOutputStream();
	ouputStream.write(bytes, 0, bytes.length);
	ouputStream.flush();
	ouputStream.close();
%>
<%@ include file="../../connection/conexion_cerrar.jsp"%>