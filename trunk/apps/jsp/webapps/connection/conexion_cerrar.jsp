<%
    	conn.close();
		conn=null;
	} 
	finally {
		if ( conn!=null ) {
			conn.close();	conn = null;
		}	
	}
	
%>