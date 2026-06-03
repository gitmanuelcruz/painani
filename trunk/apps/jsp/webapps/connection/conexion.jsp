<%@ page import = "java.sql.*" %>
<%@ page import="org.postgresql.Driver,javax.naming.*,javax.sql.DataSource"%> 
<%!	
	public static Connection getConexion(String datasource) throws Exception
	{	
		Context initContext = new InitialContext();
		Context envContext  = (Context)initContext.lookup("java:/comp/env");
		DataSource ds = (DataSource)envContext.lookup("jdbc/"+datasource );
		Connection conn = ds.getConnection();
		
		return conn;
	}		
%>
<%
    String  usuariodb = (String)request.getAttribute("usuariodb");
	if(usuariodb == null)
		throw new Exception("El nombre del Data Source no debe ser null ");
		
	Connection conn =null;	
	try
	{	
		conn = getConexion( usuariodb );
	
%>