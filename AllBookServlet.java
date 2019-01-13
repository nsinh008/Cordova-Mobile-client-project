package com.org.book.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.Invocation;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.GenericType;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import com.org.book.sslConfig.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.org.book.model.Book;

/**
 * Servlet implementation class AllBookServlet
 */
@WebServlet("/allBook")
public class AllBookServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
    
	/**
	 * Processes the HTTP Get and Post Requests to get all the books available in the Database Table Book
	 * 
	 * @param request
	 * @param response
	 * @throws ServletException
	 * @throws IOException
	 */
    protected void getAllBooks(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {   
    	SslConfig sslconf= new SslConfig();
    	Client client = sslconf.ssl();
    	
		String URL= "https://localhost:8443/OnlineBookStore/rest/ProductCatalog/getAllBooks";
		WebTarget target= client.target(URL);
		
		try {
			response.setContentType("application/json;charset=UTF-8");
			 
			response.setHeader("Cache-Control", "no-cache");
			// get the PrintWriter object to write the html page
			PrintWriter out = response.getWriter();
			
			Invocation.Builder ib = target.request(MediaType.APPLICATION_JSON);
			
			Response res = ib.get();
			
			
			Gson gsonBuilder = new GsonBuilder().create();
			List<Book> booklist = res.readEntity(new GenericType<List<Book>>() {
			});
			System.out.println("Before converting to json");
			System.out.println(booklist);
			
			String jsonData = gsonBuilder.toJson(booklist);
			
//			JSONObject books = new JSONObject(booklist);
			System.out.println(jsonData);
			//String tempStr = "BookListJsonDataParse(" + jsonData.toString() + ")";
			String tempStr = "bookListJsonDataParse(" + jsonData.toString() + ")";
			out.print(tempStr);
			
//			
//			List<Book> booklist = res.readEntity(new GenericType<List<Book>>() {
//			});
			
		//	request.setAttribute("booklist", booklist);
		//	request.getRequestDispatcher("index.jsp").forward(request, response);
			
		}
       
		catch (Exception e) 
		{
		   e.printStackTrace();
	    }
    }
    
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		getAllBooks(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		getAllBooks(request, response);
	}

}
